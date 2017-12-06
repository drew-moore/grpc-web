import {Metadata} from "../metadata";
import {Transport, TransportOptions} from "./Transport";
import {debug} from "../debug";
import detach from "../detach";

enum WebsocketSignal {
  FINISH_SEND = 1
}

const finishSendFrame = new Uint8Array([64, 0, 0, 0, 0]);

/* websocketRequest uses Websockets and requires the server to enable experimental websocket support */
export default function websocketRequest(options: TransportOptions): Transport {
  options.debug && debug("websocketRequest", options);

  let httpAddress = `${options.url}`;
  httpAddress = httpAddress.substr(8);

  const webSocketAddress = `wss://${httpAddress}`;

  const sendQueue: Array<ArrayBufferView | WebsocketSignal> = [];
  let ws: WebSocket;

  function sendToWebsocket(toSend: ArrayBufferView | WebsocketSignal) {
    if (toSend === WebsocketSignal.FINISH_SEND) {
      ws.send(finishSendFrame);
    } else {
      ws.send(toSend)
    }
  }

  return {
    sendMessage: (msgBytes: ArrayBufferView) => {
      if (!ws || ws.readyState === ws.CONNECTING) {
        sendQueue.push(msgBytes);
      } else {
        sendToWebsocket(msgBytes);
      }
    },
    finishSend: () => {
      if (!ws || ws.readyState === ws.CONNECTING) {
        sendQueue.push(WebsocketSignal.FINISH_SEND);
      } else {
        sendToWebsocket(WebsocketSignal.FINISH_SEND);
      }
    },
    start: (metadata: Metadata) => {
      ws = new WebSocket(webSocketAddress, ['grpc-websockets']);
      ws.binaryType = "arraybuffer";
      ws.onopen = function () {
        options.debug && debug("websocketRequest.onopen");
        ws.send(headersToBytes(metadata));

        // send any messages that were passed to sendMessage before the connection was ready
        sendQueue.forEach(toSend => {
          sendToWebsocket(toSend);
        });
      };

      ws.onclose = function () {
        options.debug && debug("websocketRequest.onclose");
        detach(() => {
          options.onEnd();
        });
      };

      ws.onerror = function (error) {
        options.debug && debug("websocketRequest.onerror", error);
      };

      ws.onmessage = function (e) {
        detach(() => {
          options.onChunk(new Uint8Array(e.data));
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

function headersToBytes(headers: Metadata): Uint8Array {
  let asString = '';
  headers.forEach((key, values) => {
    asString += `${key}: ${values.join(', ')}\r\n`;
  });
  return new TextEncoder().encode(asString);
}
