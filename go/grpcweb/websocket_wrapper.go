package grpcweb

import (
	"bufio"
	"bytes"
	"encoding/binary"
	"fmt"
	"golang.org/x/net/http2"
	"golang.org/x/net/websocket"
	"io"
	"net/http"
	"net/textproto"
	"strings"
)

type WebSocketWrapper struct {
	wsConn *websocket.Conn
}

type WebSocketResponseWriter struct {
	wsConn          *websocket.Conn
	headers         http.Header
	closeNotifyChan chan bool
}

func newWebSocketResponseWriter(wsConn *websocket.Conn) *WebSocketResponseWriter {
	return &WebSocketResponseWriter{
		headers:         make(http.Header),
		wsConn:          wsConn,
		closeNotifyChan: make(chan bool),
	}
}

func (w *WebSocketResponseWriter) Header() http.Header {
	return w.headers
}

func (w *WebSocketResponseWriter) Write(b []byte) (int, error) {
	fmt.Println("RespWrite", b, string(b))
	return w.wsConn.Write(b)
}

func (w *WebSocketResponseWriter) writeHeaderFrame(headers http.Header) {
	headerBuffer := new(bytes.Buffer)
	headers.Write(headerBuffer)
	headerGrpcDataHeader := []byte{1 << 7, 0, 0, 0, 0} // MSB=1 indicates this is a header data frame.
	binary.BigEndian.PutUint32(headerGrpcDataHeader[1:5], uint32(headerBuffer.Len()))
	fmt.Println("WritingHeaderLength", headerGrpcDataHeader)
	w.wsConn.Write(headerGrpcDataHeader)
	fmt.Println("WritingHeaderBytes", string(headerBuffer.Bytes()))
	w.wsConn.Write(headerBuffer.Bytes())
}

func (w *WebSocketResponseWriter) WriteHeader(code int) {
	fmt.Println("RespWriteHeader", code)
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
	fmt.Println("FlushTrailers")
	w.writeHeaderFrame(w.extractTrailerHeaders())
}

func (w *WebSocketResponseWriter) Flush() {
	fmt.Println("Flush")
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
	n, err := w.wsConn.Read(p)
	if err == io.EOF {
		fmt.Println("EOF!")
		defer func() {
			w.respWriter.closeNotifyChan <- true
		}()
	}
	return n, err
}

func NewWebsocketWrappedReader(wsConn *websocket.Conn, respWriter *WebSocketResponseWriter) *WebSocketWrappedReader {
	return &WebSocketWrappedReader{
		wsConn,
		respWriter,
	}
}

func NewWebSocketWrapper(resp http.ResponseWriter, req *http.Request, w *WrappedGrpcServer) {
	websocket.Handler(func(wsConn *websocket.Conn) {
		wsConn.PayloadType = websocket.BinaryFrame

		fmt.Println("Bridging Websocket")

		respWriter := newWebSocketResponseWriter(wsConn)

		var readLengthBuffer [5]byte
		if _, err := wsConn.Read(readLengthBuffer[:]); err != nil {
			fmt.Println("ReadHeaderLength.err", err)
			return
		}

		fmt.Println("readLengthBuffer", readLengthBuffer)

		headerLength := binary.BigEndian.Uint32(readLengthBuffer[1:])

		readBytes := make([]byte, int(headerLength))

		if _, err := wsConn.Read(readBytes); err != nil {
			if err == io.EOF {
				err = io.ErrUnexpectedEOF
			}
			fmt.Println("ReadHeader.err", err)
			return
		}

		fmt.Println("readBytes", readBytes, string(readBytes))
		headers, err := parseHeaders(string(readBytes))
		if err != nil {
			fmt.Println("parseHeaders.err", err)
			return
		}

		wrappedReader := NewWebsocketWrappedReader(wsConn, respWriter)

		req.Body = wrappedReader
		req.Method = http.MethodPost
		req.Header = headers
		req.ProtoMajor = 2
		req.ProtoMinor = 0
		contentType := req.Header.Get("content-type")
		req.Header.Set("content-type", strings.Replace(contentType, "application/grpc-web", "application/grpc", 1))

		fmt.Println("Going to ServeHTTP")
		w.server.ServeHTTP(respWriter, req)
		fmt.Println("After ServeHTTP", respWriter.Header())
	}).ServeHTTP(resp, req)
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
