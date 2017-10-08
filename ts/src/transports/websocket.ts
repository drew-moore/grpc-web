import {Metadata} from "../grpc";
import {TransportInterface, TransportOptions} from "./Transport";
import {debug} from "../debug";
import detach from "../detach";

/* websocketRequest uses Websockets */
export default function websocketRequest(options: TransportOptions): TransportInterface {
  let httpAddress = `${options.url}`;
  httpAddress = httpAddress.substr(8);

  const webSocketAddress = `wss://${httpAddress}`;
  console.log("webSocketAddress", webSocketAddress);

  const sendQueue: Array<ArrayBufferView> = [];
  const ws = new WebSocket(webSocketAddress);
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
    // const asString = new TextDecoder("utf-8").decode(asUint8Array);
    // console.log("asUint8Array", asUint8Array);
    // console.log("asString", asString);
    detach(() => {
      options.onChunk(asUint8Array);
    });
  };

  return {
    sendMessage: (msgBytes: ArrayBufferView) => {
      if (ws.readyState === ws.CONNECTING) {
        console.log("PUSHING TO SENDQUEUE");
        sendQueue.push(msgBytes);
      } else {
        ws.send(msgBytes)
      }
    },
    start: () => {},
    cancel: () => {
      options.debug && debug("websocket.abort");
      ws.close();
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
