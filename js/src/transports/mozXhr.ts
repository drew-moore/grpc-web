import {BrowserHeaders} from "browser-headers";
import {TransportOptions} from "./Transport";

export default function mozXhrRequest(options: TransportOptions) {
  const xhr = new XMLHttpRequest();

  function onProgressEvent() {
    setTimeout(() => {
      options.onChunk(new Uint8Array(xhr.response));
    });
  }

  function onLoadEvent() {
    setTimeout(() => {
      options.onComplete();
    });
  }

  function onStateChange() {
    if(this.readyState == this.HEADERS_RECEIVED) {
      setTimeout(() => {
        options.onHeaders(new BrowserHeaders(this.getAllResponseHeaders()), this.status);
      });
    }
  }

  xhr.open("POST", options.url);
  xhr.responseType = 'moz-chunked-arraybuffer';
  options.headers.forEach((key, values) => {
    xhr.setRequestHeader(key, values.join(", "));
  });
  if (options.credentials === 'include') {
    xhr.withCredentials = true;
  }
  xhr.addEventListener('readystatechange', onStateChange);
  xhr.addEventListener('progress', onProgressEvent);
  xhr.addEventListener('loadend', onLoadEvent);
  xhr.addEventListener('error', (err: ErrorEvent) => {
    setTimeout(() => {
      options.onComplete(err.error);
    });
  });
  xhr.send(options.body);
}
