import * as http from "http";
import * as https from "https";
import * as url from "url";
import {Transport, TransportOptions} from "./Transport";
import {Metadata} from "../metadata";

/* nodeHttpRequest uses the node http and https modules */
export default function nodeHttpRequest(options: TransportOptions): Transport {
  options.debug && console.log("nodeHttpRequest", options);

  return new NodeHttp(options);
}

class NodeHttp implements Transport {
  options: TransportOptions;
  request: http.ClientRequest;

  constructor(transportOptions: TransportOptions) {
    this.options = transportOptions;
  }

  sendMessage(msgBytes: ArrayBufferView) {
    this.request.write(toBuffer(msgBytes));
    this.request.end();
  }

  responseCallback(response: http.IncomingMessage) {
    this.options.debug && console.log("NodeHttp.response", response.statusCode);
    this.options.onHeaders(new Metadata(response.headers), response.statusCode!);

    response.on("data", chunk => {
      this.options.debug && console.log("NodeHttp.data", chunk);
      this.options.onChunk(toArrayBuffer(chunk as Buffer));
    });

    response.on("end", () => {
      this.options.debug && console.log("NodeHttp.end");
      this.options.onEnd();
    });
  };

  start(metadata: Metadata) {
    const headers: { [key: string]: string } = {};
    metadata.forEach((key, values) => {
      headers[key] = values.join(", ");
    });
    const parsedUrl = url.parse(this.options.url);

    const httpOptions = {
      host: parsedUrl.hostname,
      port: parsedUrl.port ? parseInt(parsedUrl.port) : undefined,
      path: parsedUrl.path,
      headers: headers,
      method: "POST"
    };
    if (parsedUrl.protocol === "https:") {
      this.request = https.request(httpOptions, this.responseCallback.bind(this));
    } else {
      this.request = http.request(httpOptions, this.responseCallback.bind(this));
    }
    this.request.on("error", err => {
      this.options.debug && console.log("NodeHttp.error", err);
      this.options.onEnd(err);
    });
  }

  cancel() {
    this.options.debug && console.log("NodeHttp.abort");
    this.request.abort();
  }
}

function toArrayBuffer(buf: Buffer): Uint8Array {
  const view = new Uint8Array(buf.length);
  for (let i = 0; i < buf.length; i++) {
    view[i] = buf[i];
  }
  return view;
}

function toBuffer(ab: ArrayBufferView): Buffer {
  const buf = new Buffer(ab.byteLength);
  const view = new Uint8Array(ab.buffer);
  for (let i = 0; i < buf.length; i++) {
    buf[i] = view[i];
  }
  return buf;
}
