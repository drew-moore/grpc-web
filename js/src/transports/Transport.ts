import {BrowserHeaders} from "browser-headers";
import fetchRequest from "./fetch";
import xhrRequest from "./xhr";

declare const Response: any;

export interface Transport {
  (options: TransportOptions): void;
}

export type TransportOptions = {
  url: string,
  headers: BrowserHeaders,
  credentials: string,
  body: ArrayBuffer,
  onHeaders: (headers: BrowserHeaders, status: number) => void,
  onChunk: (chunkBytes: Uint8Array, flush?: boolean) => void,
  onComplete: (err?: Error) => void,
}

export class DefaultTransportFactory {
  static selected: Transport;
  static getTransport(): Transport {
    if (!this.selected) {
      this.selected = DefaultTransportFactory.detectTransport();
    }
    return this.selected;
  }

  static detectTransport() {
    if (typeof Response !== 'undefined' && Response.prototype.hasOwnProperty("body") && typeof Headers === 'function') {
      return fetchRequest;
    }
    const mozChunked = 'moz-chunked-arraybuffer';
    if (DefaultTransportFactory.supportsXhrResponseType(mozChunked)) {
      return mozXhrRequest;
    }

    return xhrRequest;
  }

  static supportsXhrResponseType(type: string) {
    try {
      const tmpXhr = new XMLHttpRequest();
      tmpXhr.responseType = type;
      return tmpXhr.responseType === type;
    } catch (e) {
      /* IE throws on setting responseType to an unsupported value */
    }
    return false;
  }
}