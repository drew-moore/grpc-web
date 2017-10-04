package grpcweb

import (
	"bufio"
	"fmt"
	"golang.org/x/net/websocket"
	"net/http"
	"net/textproto"
	"strings"
	"time"
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
	return &WebSocketResponseWriter{headers: make(http.Header), wsConn: wsConn}
}

func (w *WebSocketResponseWriter) Header() http.Header {
	return w.headers
}

func (w *WebSocketResponseWriter) Write(b []byte) (int, error) {
	fmt.Println("RespWrite", b, string(b))
	return w.wsConn.Write(b)
}

func (w *WebSocketResponseWriter) WriteHeader(code int) {
	fmt.Println("RespWriteHeader", code)
	return
}

func (w *WebSocketResponseWriter) Flush() {
	fmt.Println("Flush")
}

func (w *WebSocketResponseWriter) CloseNotify() <-chan bool {
	return w.closeNotifyChan
}

func NewWebSocketWrapper(resp http.ResponseWriter, req *http.Request, w *WrappedGrpcServer) {
	websocket.Handler(func(wsConn *websocket.Conn) {
		wsConn.PayloadType = websocket.BinaryFrame

		fmt.Println("Bridging Websocket")

		respWriter := newWebSocketResponseWriter(wsConn)

		go func() {
			time.Sleep(1 * time.Second)
			readBuffer := make([]byte, 1024)
			length, err := wsConn.Read(readBuffer)
			fmt.Println("length, err", length, err)
			fmt.Println("readBuffer", readBuffer, string(readBuffer))
			if err != nil {
				fmt.Println("ReadFrom.err", err)
				return
			}

			readBytes := make([]byte, length)
			copy(readBytes, readBuffer)

			fmt.Println("readBytes", readBytes, string(readBytes))

			headers, err := parseHeaders(string(readBytes))
			if err != nil {
				fmt.Println("parseHeaders.err", err)
				return
			}

			req.Body = wsConn
			req.Method = http.MethodPost
			req.Header = headers
			req.ProtoMajor = 2
			req.ProtoMinor = 0
			contentType := req.Header.Get("content-type")
			req.Header.Set("content-type", strings.Replace(contentType, "application/grpc-web", "application/grpc", 1))

			fmt.Println("Going to ServeHTTP")

			w.server.ServeHTTP(respWriter, req)
		}()
		time.Sleep(5 * time.Second)
		//defer wsConn.Close()
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
