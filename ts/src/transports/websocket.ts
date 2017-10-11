import {Metadata} from "../grpc";
import {TransportInterface, TransportOptions} from "./Transport";
import {debug} from "../debug";
import detach from "../detach";

/* websocketRequest uses Websockets and requires the server to enable experimental websocket support */
export default function websocketRequest(options: TransportOptions): TransportInterface {
  let httpAddress = `${options.url}`;
  httpAddress = httpAddress.substr(8);

  const webSocketAddress = `wss://${httpAddress}`;
  console.log("webSocketAddress", webSocketAddress);

  const sendQueue: Array<ArrayBufferView> = [];
  let ws: WebSocket;

  return {
    sendMessage: (msgBytes: ArrayBufferView) => {
      if (!ws || ws.readyState === ws.CONNECTING) {
        sendQueue.push(msgBytes);
      } else {
        ws.send(msgBytes)
      }
    },
    start: () => {
      ws = new WebSocket(webSocketAddress, ['grpc-websockets']);
      ws.binaryType = "arraybuffer";
      ws.onopen = function () {
        console.log("websocket.onopen");
        ws.send(frameHeaders(options.headers));

        sendQueue.forEach(toSend => {
          ws.send(toSend);
        });
      };

      ws.onclose = function () {
        console.log("WebSocket Closed");
        detach(() => {
          options.onEnd();
        });
      };

      ws.onerror = function (error) {
        console.log('WebSocket Error ' + error);
      };

      ws.onmessage = function (e) {
        const asUint8Array = new Uint8Array(e.data);
        detach(() => {
          options.onChunk(asUint8Array);
        });
      };

    },
    cancel: () => {
      options.debug && debug("websocket.abort");
      detach(() => {
        ws.close();
      });
    }
  };
}

function frameHeaders(headers: Metadata): Uint8Array {
  let asString = '';
  headers.forEach((key, values) => {
    asString += `${key}: ${values.join(', ')}\r\n`;
  });
  const bytes = new TextEncoder().encode(asString);
  const frame = new ArrayBuffer(bytes.byteLength + 5);
  const dataview = new DataView(frame, 0, 5);
  dataview.setUint32(1, bytes.length, false /* big endian */);
  dataview.setUint8(0, 128);
  new Uint8Array(frame, 5).set(bytes);
  return new Uint8Array(frame);
}
