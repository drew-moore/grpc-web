import {BrowserHeaders} from "browser-headers";
import {TextEncoder} from "text-encoding";
import {TransportOptions} from "./Transport";

export default function xhrRequest(options: TransportOptions) {
  const textEncoder = new TextEncoder();
  const xhr = new XMLHttpRequest();
  let index = 0;

  function onProgressEvent() {
    const rawText = xhr.responseText.substr(index);
    console.debug("xhr.rawText",rawText);
    index = xhr.responseText.length;
    setTimeout(() => {
      options.onChunk(textEncoder.encode(rawText, {stream: true}));
    });
  }

  function onLoadEvent() {
    setTimeout(() => {
      // Force the textEncoder to flush.
      options.onChunk(textEncoder.encode("", {stream: false}));
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
  xhr.responseType = 'text';
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
