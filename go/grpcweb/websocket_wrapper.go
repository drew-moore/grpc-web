package grpcweb

import (
	"bufio"
	"bytes"
	"encoding/binary"
	"github.com/gorilla/websocket"
	"io"
	"net/http"
	"net/textproto"
	"strings"
	"golang.org/x/net/http2"
)

type WebSocketWrapper struct {
	wsConn *websocket.Conn
}

type WebSocketResponseWriter struct {
	writtenHeaders  bool
	wsConn          *websocket.Conn
	headers         http.Header
	closeNotifyChan chan bool
}

func newWebSocketResponseWriter(wsConn *websocket.Conn) *WebSocketResponseWriter {
	return &WebSocketResponseWriter{
		writtenHeaders:  false,
		headers:         make(http.Header),
		wsConn:          wsConn,
		closeNotifyChan: make(chan bool),
	}
}

func (w *WebSocketResponseWriter) Header() http.Header {
	return w.headers
}

func (w *WebSocketResponseWriter) Write(b []byte) (int, error) {
	if !w.writtenHeaders {
		w.WriteHeader(http.StatusOK)
	}
	return len(b), w.wsConn.WriteMessage(websocket.BinaryMessage, b)
}

func (w *WebSocketResponseWriter) writeHeaderFrame(headers http.Header) {
	headerBuffer := new(bytes.Buffer)
	headers.Write(headerBuffer)
	headerGrpcDataHeader := []byte{1 << 7, 0, 0, 0, 0} // MSB=1 indicates this is a header data frame.
	binary.BigEndian.PutUint32(headerGrpcDataHeader[1:5], uint32(headerBuffer.Len()))
	w.wsConn.WriteMessage(websocket.BinaryMessage, headerGrpcDataHeader)
	w.wsConn.WriteMessage(websocket.BinaryMessage, headerBuffer.Bytes())
}

func (w *WebSocketResponseWriter) WriteHeader(code int) {
	w.writtenHeaders = true
	w.writeHeaderFrame(w.headers)
	return
}

func (w *WebSocketResponseWriter) extractTrailerHeaders() http.Header {
	trailerHeaders := make(http.Header)
	for k, vv := range w.headers {
		// Skip the pre-annoucement of Trailer headers. Don't add them to the response headers.
		if strings.ToLower(k) == "trailer" {
			continue
		}
		//// Skip existing headers that were already sent.
		//if _, exists := flushedHeaders[k]; exists {
		//	continue
		//}
		// Skip the Trailer prefix
		if strings.HasPrefix(k, http2.TrailerPrefix) {
			k = k[len(http2.TrailerPrefix):]
		}
		for _, v := range vv {
			trailerHeaders.Add(k, v)
		}
	}
	return trailerHeaders
}

func (w *WebSocketResponseWriter) FlushTrailers() {
	w.writeHeaderFrame(w.extractTrailerHeaders())
}

func (w *WebSocketResponseWriter) Flush() {
	// no-op
}

func (w *WebSocketResponseWriter) CloseNotify() <-chan bool {
	return w.closeNotifyChan
}

type WebSocketWrappedReader struct {
	wsConn     *websocket.Conn
	respWriter *WebSocketResponseWriter
}

func (w *WebSocketWrappedReader) Close() error {
	w.respWriter.FlushTrailers()
	return w.wsConn.Close()
}

func (w *WebSocketWrappedReader) Read(p []byte) (int, error) {
	messageType, payload, err := w.wsConn.ReadMessage()
	if err == io.EOF || messageType == -1 {
		defer func() {
			w.respWriter.closeNotifyChan <- true
		}()
	}

	if len(payload) == 5 && payload[0] == 64 && payload[1] == 0 && payload[2] == 0 && payload[3] == 0 && payload[4] == 0 {
		return 0, io.EOF
	}

	copy(p, payload)
	return len(payload), nil
}

func NewWebsocketWrappedReader(wsConn *websocket.Conn, respWriter *WebSocketResponseWriter) *WebSocketWrappedReader {
	return &WebSocketWrappedReader{
		wsConn,
		respWriter,
	}
}

func parseHeaders(headerString string) (http.Header, error) {
	reader := bufio.NewReader(strings.NewReader(headerString + "\r\n"))
	tp := textproto.NewReader(reader)

	mimeHeader, err := tp.ReadMIMEHeader()
	if err != nil {
		return nil, err
	}

	// http.Header and textproto.MIMEHeader are both just a map[string][]string
	return http.Header(mimeHeader), nil
}
