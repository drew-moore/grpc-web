import {Metadata} from "../grpc";
import {CancelFunc, TransportOptions} from "./Transport";
import {debug} from "../debug";
import detach from "../detach";

/* websocketRequest uses Websockets */
export default function websocketRequest(options: TransportOptions): CancelFunc {
  let cancelled = false;
  let reader: ReadableStreamReader;
  options.debug && debug("websocketRequest", options);
  function pump(readerArg: ReadableStreamReader, res: Response): Promise<void|Response> {
    reader = readerArg;
    if (cancelled) {
      // If the request was cancelled before the first pump then cancel it here
      options.debug && debug("websocketRequest.pump.cancel");
      return reader.cancel();
    }
    return reader.read()
      .then((result: { done: boolean, value: Uint8Array }) => {
        if (result.done) {
          detach(() => {
            options.onEnd();
          });
          return res;
        }
        detach(() => {
          options.onChunk(result.value);
        });
        return pump(reader, res);
      });
  }

  let httpAddress = `${options.url}`;
  httpAddress = httpAddress.substr(8);

  const webSocketAddress = `wss://${httpAddress}`;
  console.log("webSocketAddress", webSocketAddress);

  const ws = new WebSocket(webSocketAddress);
  ws.binaryType = "arraybuffer";
  ws.onopen = function () {
    console.log("websocket.onopen");
    let headersString = "";
    options.headers.forEach((key, values) => {
      headersString += `${key}: ${values.join(",")}\r\n`
    });
    ws.send(new TextEncoder().encode(headersString))

    setTimeout(() => {
      ws.send(options.body)
    }, 1250);
  };

  ws.onclose = function () {
    console.log("WebSocket Closed");
  };

  ws.onerror = function (error) {
    console.log('WebSocket Error ' + error);
  };

  ws.onmessage = function (e) {
    options.onChunk(new Uint8Array(e.data));
  };

  return () => {
    if (reader) {
      // If the reader has already been received in the pump then it can be cancelled immediately
      options.debug && debug("websocketRequest.abort.cancel");
      reader.cancel();
    }
    cancelled = true;
  }
}
