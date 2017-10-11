import * as jspb from "google-protobuf";
import {BrowserHeaders as Metadata} from "browser-headers";
import {ChunkParser, Chunk, ChunkType} from "./ChunkParser";
import {Transport, TransportOptions, DefaultTransportFactory, TransportFactory, WebsocketTransportFactory} from "./transports/Transport";
import {debug} from "./debug";
import detach from "./detach";
import {Code} from "./Code";

export {
  Metadata,
  Transport,
  DefaultTransportFactory,
  WebsocketTransportFactory,
  TransportOptions,
  Code,
};

export type Request = {
  abort: () => void
}

export namespace grpc {

  export interface ProtobufMessageClass<T extends jspb.Message> {
    new(): T;
    deserializeBinary(bytes: Uint8Array): T;
  }

  function httpStatusToCode(httpStatus: number): Code {
    switch (httpStatus) {
      case 0: // Connectivity issues
        return Code.Internal;
      case 200:
        return Code.OK;
      case 400:
        return Code.InvalidArgument;
      case 401:
        return Code.Unauthenticated;
      case 403:
        return Code.PermissionDenied;
      case 404:
        return Code.NotFound;
      case 409:
        return Code.Aborted;
      case 412:
        return Code.FailedPrecondition;
      case 429:
        return Code.ResourceExhausted;
      case 499:
        return Code.Canceled;
      case 500:
        return Code.Unknown;
      case 501:
        return Code.Unimplemented;
      case 503:
        return Code.Unavailable;
      case 504:
        return Code.DeadlineExceeded;
      default:
        return Code.Unknown;
    }
  }

  export interface ServiceDefinition {
    serviceName: string;
  }

  export interface MethodDefinition<TRequest extends jspb.Message, TResponse extends jspb.Message> {
    methodName: string;
    service: ServiceDefinition;
    requestStream: boolean;
    responseStream: boolean;
    requestType: ProtobufMessageClass<TRequest>;
    responseType: ProtobufMessageClass<TResponse>;
  }

  export type UnaryMethodDefinition<TRequest extends jspb.Message, TResponse extends jspb.Message> = MethodDefinition<TRequest, TResponse> & {
    responseStream: false;
  }

  export type RpcOptions<TRequest extends jspb.Message, TResponse extends jspb.Message> = {
    host: string,
    request: TRequest,
    metadata?: Metadata.ConstructorArg,
    onHeaders?: (headers: Metadata) => void,
    onMessage?: (res: TResponse) => void,
    onEnd: (code: Code, message: string, trailers: Metadata) => void,
    transport?: Transport,
    transportFactory?: TransportFactory,
    debug?: boolean,
  }

  export type UnaryOutput<TResponse> = {
    status: Code,
    statusMessage: string;
    headers: Metadata;
    message: TResponse | null;
    trailers: Metadata;
  }

  export type UnaryRpcOptions<M extends UnaryMethodDefinition<TRequest, TResponse>, TRequest extends jspb.Message, TResponse extends jspb.Message> = {
    host: string,
    request: TRequest,
    metadata?: Metadata.ConstructorArg,
    onEnd: (output: UnaryOutput<TResponse>) => void,
    transport?: Transport,
    transportFactory?: TransportFactory,
    debug?: boolean,
  }

  function frameRequest(request: jspb.Message): ArrayBufferView {
    const bytes = request.serializeBinary();
    const frame = new ArrayBuffer(bytes.byteLength + 5);
    new DataView(frame, 1, 4).setUint32(0, bytes.length, false /* big endian */);
    new Uint8Array(frame, 5).set(bytes);
    return new Uint8Array(frame);
  }

  function getStatusFromHeaders(headers: Metadata): Code | null {
    const fromHeaders = headers.get("grpc-status") || [];
    if (fromHeaders.length > 0) {
      try {
        const asString = fromHeaders[0];
        return parseInt(asString, 10);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  export function unary<TRequest extends jspb.Message, TResponse extends jspb.Message, M extends UnaryMethodDefinition<TRequest, TResponse>>(methodDescriptor: M, props: UnaryRpcOptions<M, TRequest, TResponse>): Request {
    if (methodDescriptor.responseStream) {
      throw new Error(".unary cannot be used with server-streaming methods. Use .invoke or .client instead.");
    }
    if (methodDescriptor.requestStream) {
      throw new Error(".unary cannot be used with client-streaming methods. Use .client instead.");
    }
    let responseHeaders: Metadata | null = null;
    let responseMessage: TResponse | null = null;
    const rpcOpts: RpcOptions<TRequest, TResponse> = {
      host: props.host,
      request: props.request,
      metadata: props.metadata,
      onHeaders: (headers: Metadata) => {
        responseHeaders = headers;
      },
      onMessage: (res: TResponse) => {
        responseMessage = res;
      },
      onEnd: (status: Code, statusMessage: string, trailers: Metadata) => {
        props.onEnd({
          status: status,
          statusMessage: statusMessage,
          headers: responseHeaders ? responseHeaders : new Metadata(),
          message: responseMessage,
          trailers: trailers
        });
      },
      transport: props.transport,
      debug: props.debug,
    };
    return grpc.invoke(methodDescriptor, rpcOpts);
  }

  export type Client<TRequest extends jspb.Message, TResponse extends jspb.Message> = {
    start: () => void
    close: () => void
    onHeaders: (callback: (headers: Metadata) => void) => void
    onMessage: (callback: (res: TResponse) => void) => void
    send: (msg: TRequest) => void
    onEnd: (callback: (code: Code, message: string, trailers: Metadata) => void) => void
  }

  export type ClientRpcOptions<TRequest extends jspb.Message, TResponse extends jspb.Message> = {
    host: string,
    metadata?: Metadata.ConstructorArg,
    transport?: Transport,
    transportFactory?: TransportFactory,
    debug?: boolean,
  }

  export function client<TRequest extends jspb.Message, TResponse extends jspb.Message, M extends MethodDefinition<TRequest, TResponse>>(methodDescriptor: M, props: ClientRpcOptions<TRequest, TResponse>): Client<TRequest, TResponse> {
    const requestHeaders = new Metadata(props.metadata ? props.metadata : {});
    requestHeaders.set("content-type", "application/grpc-web+proto");
    requestHeaders.set("x-grpc-web", "1"); // Required for CORS handling

    const onHeadersCallbacks: Array<(headers: Metadata) => void> = [];
    const onMessageCallbacks: Array<(res: TResponse) => void> = [];
    const onEndCallbacks: Array<(code: Code, message: string, trailers: Metadata) => void> = [];

    let completed = false;
    function rawOnEnd(code: Code, message: string, trailers: Metadata) {
      props.debug && debug("rawOnEnd", code, message, trailers);
      if (completed) return;
      completed = true;

      onEndCallbacks.forEach(callback => {
        detach(() => {
          callback(code, message, trailers);
        });
      });
    }

    function rawOnHeaders(headers: Metadata) {
      props.debug && debug("rawOnHeaders", headers);
      if (completed) return;
      onHeadersCallbacks.forEach(callback => {
        detach(() => {
          callback(headers);
        });
      });
    }

    function rawOnError(code: Code, msg: string) {
      props.debug && debug("rawOnError", code, msg);
      if (completed) return;
      completed = true;
      onEndCallbacks.forEach(callback => {
        detach(() => {
          callback(code, msg, new Metadata());
        });
      });
    }

    function rawOnMessage(res: TResponse) {
      props.debug && debug("rawOnMessage", res.toObject());
      if (completed) return;
      onMessageCallbacks.forEach(callback => {
        detach(() => {
          callback(res);
        });
      });
    }

    let aborted = false;
    let responseHeaders: Metadata;
    let responseTrailers: Metadata;
    const parser = new ChunkParser();

    let transport = props.transport;
    if (!transport) {
      let transportFactory = props.transportFactory;
      if (transportFactory) {
        transport = transportFactory();
      } else {
        transport = DefaultTransportFactory();
      }
    }
    const transportObj = transport({
      debug: props.debug || false,
      url: `${props.host}/${methodDescriptor.service.serviceName}/${methodDescriptor.methodName}`,
      headers: requestHeaders,
      onHeaders: (headers: Metadata, status: number) => {
        props.debug && debug("onHeaders", headers, status);

        if (aborted) {
          props.debug && debug("grpc.onHeaders received after request was aborted - ignoring");
          return;
        }

        if (status === 0) {
          // The request has failed due to connectivity issues. Do not capture the headers
        } else {
          responseHeaders = headers;
          props.debug && debug("onHeaders.responseHeaders", JSON.stringify(responseHeaders, null, 2));
          const code = httpStatusToCode(status);
          props.debug && debug("onHeaders.code", code);
          const gRPCMessage = headers.get("grpc-message") || [];
          props.debug && debug("onHeaders.gRPCMessage", gRPCMessage);
          if (code !== Code.OK) {
            rawOnError(code, gRPCMessage[0]);
            return;
          }

          rawOnHeaders(headers);
        }
      },
      onChunk: (chunkBytes: Uint8Array) => {
        if (aborted) {
          props.debug && debug("grpc.onChunk received after request was aborted - ignoring");
          return;
        }

        let data: Chunk[] = [];
        try {
          data = parser.parse(chunkBytes);
        } catch (e) {
          props.debug && debug("onChunk.parsing error", e, e.message);
          rawOnError(Code.Internal, `parsing error: ${e.message}`);
          return;
        }

        data.forEach((d: Chunk) => {
          if (d.chunkType === ChunkType.MESSAGE) {
            const deserialized = methodDescriptor.responseType.deserializeBinary(d.data!);
            rawOnMessage(deserialized);
          } else if (d.chunkType === ChunkType.TRAILERS) {
            if (!responseHeaders) {
              responseHeaders = new Metadata(d.trailers);
              rawOnHeaders(responseHeaders);
            } else {
              responseTrailers = new Metadata(d.trailers);
              props.debug && debug("onChunk.trailers", responseTrailers);
            }
          }
        });
      },
      onEnd: () => {
        props.debug && debug("grpc.onEnd");

        if (aborted) {
          props.debug && debug("grpc.onEnd received after request was aborted - ignoring");
          return;
        }

        if (responseTrailers === undefined) {
          if (responseHeaders === undefined) {
            // The request was unsuccessful - it did not receive any headers
            rawOnError(Code.Internal, "Response closed without headers");
            return;
          }

          const grpcStatus = getStatusFromHeaders(responseHeaders);
          const grpcMessage = responseHeaders.get("grpc-message");

          // This was a headers/trailers-only response
          props.debug && debug("grpc.headers only response ", grpcStatus, grpcMessage);

          if (grpcStatus === null) {
            rawOnEnd(Code.Internal, "Response closed without grpc-status (Headers only)", responseHeaders);
            return;
          }

          // Return an empty trailers instance
          rawOnEnd(grpcStatus, grpcMessage[0], responseHeaders);
          return;
        }

        // There were trailers - get the status from them
        const grpcStatus = getStatusFromHeaders(responseTrailers);
        if (grpcStatus === null) {
          rawOnError(Code.Internal, "Response closed without grpc-status (Trailers provided)");
          return;
        }

        const grpcMessage = responseTrailers.get("grpc-message");
        rawOnEnd(grpcStatus, grpcMessage[0], responseTrailers);
      }
    });

    return {
      onHeaders: callback => {
        onHeadersCallbacks.push(callback);
      },
      onEnd: callback => {
        onEndCallbacks.push(callback);
      },
      onMessage: callback => {
        onMessageCallbacks.push(callback);
      },
      close: () => {
        if (!aborted) {
          aborted = true;
          props.debug && debug("request.abort aborting request");
          transportObj.cancel();
        }
      },
      start: () => {
        transportObj.start();
      },
      send: (msg: TRequest) => {
        const msgBytes = frameRequest(msg);
        transportObj.sendMessage(msgBytes);
      },
    };
  }

  export function invoke<TRequest extends jspb.Message, TResponse extends jspb.Message, M extends MethodDefinition<TRequest, TResponse>>(methodDescriptor: M, props: RpcOptions<TRequest, TResponse>): Request {
    if (methodDescriptor.requestStream) {
      throw new Error(".invoke cannot be used with client-streaming methods. Use .client instead.");
    }

    const client = grpc.client(methodDescriptor, {
      host: props.host,
      metadata: props.metadata,
      transport: props.transport,
      transportFactory: props.transportFactory,
      debug: props.debug,
    });

    if (props.onHeaders) {
      client.onHeaders(props.onHeaders);
    }
    if (props.onMessage) {
      client.onMessage(props.onMessage);
    }
    if (props.onEnd) {
      client.onEnd(props.onEnd);
    }

    client.start();
    client.send(props.request);

    return {
      abort: () => {
        client.close();
      }
    };
  }
}
