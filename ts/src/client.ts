import {Metadata} from "./metadata";
import {ChunkParser, Chunk, ChunkType} from "./ChunkParser";
import {Code, httpStatusToCode} from "./Code";
import {debug} from "./debug";
import detach from "./detach";
import {Transport, TransportConstructor, DefaultTransportFactory, TransportFactory} from "./transports/Transport";
import {MethodDefinition} from "./service";
import {frameRequest} from "./util";
import {ProtobufMessage} from "./message";

export type ClientRpcOptions<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage> = {
  host: string,
  transport?: TransportConstructor,
  // transportFactory is only used if transport is undefined. If transportFactory is undefined then the DefaultTransportFactory is used
  transportFactory?: TransportFactory,
  debug?: boolean,
}

export interface Client<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage> {
  start(metadata?: Metadata.ConstructorArg): void;
  close(): void;
  onHeaders(callback: (headers: Metadata) => void): void;
  onMessage(callback: (res: TResponse) => void): void;
  send(msg: TRequest): void;
  onEnd(callback: (code: Code, message: string, trailers: Metadata) => void): void;
}

export function client<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage, M extends MethodDefinition<TRequest, TResponse>>(methodDescriptor: M, props: ClientRpcOptions<TRequest, TResponse>): Client<TRequest, TResponse> {
  return new ClientImpl(methodDescriptor, props);
}

export class ClientImpl<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage, M extends MethodDefinition<TRequest, TResponse>> {
  methodDescriptor: M;
  props: ClientRpcOptions<TRequest, TResponse>;

  started: boolean = false;
  sentFirstMessage: boolean = false;
  completed: boolean = false;
  closed: boolean = false;

  onHeadersCallbacks: Array<(headers: Metadata) => void> = [];
  onMessageCallbacks: Array<(res: TResponse) => void> = [];
  onEndCallbacks: Array<(code: Code, message: string, trailers: Metadata) => void> = [];

  transport: Transport;
  parser = new ChunkParser();

  responseHeaders: Metadata;
  responseTrailers: Metadata;

  constructor(methodDescriptor: M, props: ClientRpcOptions<TRequest, TResponse>) {
    this.methodDescriptor = methodDescriptor;
    this.props = props;

    this.createTransport();
  }

  createTransport() {
    let transportConstructor = this.props.transport;
    if (!transportConstructor) {
      let transportFactory = this.props.transportFactory;
      if (transportFactory) {
        const factoryTransport = transportFactory(this.methodDescriptor);
        if (factoryTransport instanceof Error) {
          throw factoryTransport;
        }
        transportConstructor = factoryTransport;
      } else {
        const factoryTransport = DefaultTransportFactory(this.methodDescriptor);
        if (factoryTransport instanceof Error) {
          throw factoryTransport;
        }
        transportConstructor = factoryTransport;
      }
    }

    const url = `${this.props.host}/${this.methodDescriptor.service.serviceName}/${this.methodDescriptor.methodName}`;

    this.transport = transportConstructor({
      debug: this.props.debug || false,
      url: url,
      onHeaders: this.onTransportHeaders.bind(this),
      onChunk: this.onTransportChunk.bind(this),
      onEnd: this.onTransportEnd.bind(this),
    });
  }

  onTransportHeaders(headers: Metadata, status: number) {
    this.props.debug && debug("onHeaders", headers, status);

    if (this.closed) {
      this.props.debug && debug("grpc.onHeaders received after request was closed - ignoring");
      return;
    }

    if (status === 0) {
      // The request has failed due to connectivity issues. Do not capture the headers
    } else {
      this.responseHeaders = headers;
      this.props.debug && debug("onHeaders.responseHeaders", JSON.stringify(this.responseHeaders, null, 2));
      const code = httpStatusToCode(status);
      this.props.debug && debug("onHeaders.code", code);
      const gRPCMessage = headers.get("grpc-message") || [];
      this.props.debug && debug("onHeaders.gRPCMessage", gRPCMessage);
      if (code !== Code.OK) {
        this.rawOnError(code, gRPCMessage[0]);
        return;
      }

      this.rawOnHeaders(headers);
    }
  }

  onTransportChunk(chunkBytes: Uint8Array) {
    if (this.closed) {
      this.props.debug && debug("grpc.onChunk received after request was closed - ignoring");
      return;
    }

    let data: Chunk[] = [];
    try {
      data = this.parser.parse(chunkBytes);
    } catch (e) {
      this.props.debug && debug("onChunk.parsing error", e, e.message);
      this.rawOnError(Code.Internal, `parsing error: ${e.message}`);
      return;
    }

    data.forEach((d: Chunk) => {
      if (d.chunkType === ChunkType.MESSAGE) {
        const deserialized = this.methodDescriptor.responseType.deserializeBinary(d.data!);
        this.rawOnMessage(deserialized);
      } else if (d.chunkType === ChunkType.TRAILERS) {
        if (!this.responseHeaders) {
          this.responseHeaders = new Metadata(d.trailers);
          this.rawOnHeaders(this.responseHeaders);
        } else {
          this.responseTrailers = new Metadata(d.trailers);
          this.props.debug && debug("onChunk.trailers", this.responseTrailers);
        }
      }
    });
  }

  onTransportEnd() {
    this.props.debug && debug("grpc.onEnd");

    if (this.closed) {
      this.props.debug && debug("grpc.onEnd received after request was closed - ignoring");
      return;
    }

    if (this.responseTrailers === undefined) {
      if (this.responseHeaders === undefined) {
        // The request was unsuccessful - it did not receive any headers
        this.rawOnError(Code.Internal, "Response closed without headers");
        return;
      }

      const grpcStatus = getStatusFromHeaders(this.responseHeaders);
      const grpcMessage = this.responseHeaders.get("grpc-message");

      // This was a headers/trailers-only response
      this.props.debug && debug("grpc.headers only response ", grpcStatus, grpcMessage);

      if (grpcStatus === null) {
        this.rawOnEnd(Code.Internal, "Response closed without grpc-status (Headers only)", this.responseHeaders);
        return;
      }

      // Return an empty trailers instance
      this.rawOnEnd(grpcStatus, grpcMessage[0], this.responseHeaders);
      return;
    }

    // There were trailers - get the status from them
    const grpcStatus = getStatusFromHeaders(this.responseTrailers);
    if (grpcStatus === null) {
      this.rawOnError(Code.Internal, "Response closed without grpc-status (Trailers provided)");
      return;
    }

    const grpcMessage = this.responseTrailers.get("grpc-message");
    this.rawOnEnd(grpcStatus, grpcMessage[0], this.responseTrailers);
  }

  rawOnEnd(code: Code, message: string, trailers: Metadata) {
    this.props.debug && debug("rawOnEnd", code, message, trailers);
    if (this.completed) return;
    this.completed = true;

    this.onEndCallbacks.forEach(callback => {
      detach(() => {
        callback(code, message, trailers);
      });
    });
  }

  rawOnHeaders(headers: Metadata) {
    this.props.debug && debug("rawOnHeaders", headers);
    if (this.completed) return;
    this.onHeadersCallbacks.forEach(callback => {
      detach(() => {
        callback(headers);
      });
    });
  }

  rawOnError(code: Code, msg: string) {
    this.props.debug && debug("rawOnError", code, msg);
    if (this.completed) return;
    this.completed = true;
    this.onEndCallbacks.forEach(callback => {
      detach(() => {
        callback(code, msg, new Metadata());
      });
    });
  }

  rawOnMessage(res: TResponse) {
    this.props.debug && debug("rawOnMessage", res.toObject());
    if (this.completed) return;
    this.onMessageCallbacks.forEach(callback => {
      detach(() => {
        callback(res);
      });
    });
  }

  onHeaders(callback: (headers: Metadata) => void) {
    this.onHeadersCallbacks.push(callback);
  }

  onMessage(callback: (res: TResponse) => void) {
    this.onMessageCallbacks.push(callback);
  }

  onEnd(callback: (code: Code, message: string, trailers: Metadata) => void) {
    this.onEndCallbacks.push(callback);
  }

  start(metadata?: Metadata.ConstructorArg) {
    if (this.started) {
      throw new Error("Client already started - cannot .start()");
    }
    this.started = true;

    const requestHeaders = new Metadata(metadata ? metadata : {});
    requestHeaders.set("content-type", "application/grpc-web+proto");
    requestHeaders.set("x-grpc-web", "1"); // Required for CORS handling

    this.transport.start(requestHeaders);
  }

  send(msg: TRequest) {
    if (!this.started) {
      throw new Error("Client not started - .start() must be called before .send()");
    }
    if (this.closed) {
      throw new Error("Client already closed - cannot .send()");
    }
    if (!this.methodDescriptor.requestStream && this.sentFirstMessage) {
      // This is a unary method and the first and only message has been sent
      throw new Error("Message already sent for non-client-streaming method - cannot .send()");
    }
    this.sentFirstMessage = true;
    const msgBytes = frameRequest(msg);
    this.transport.sendMessage(msgBytes);
  }

  close() {
    if (!this.started) {
      throw new Error("Client not started - .start() must be called before .close()");
    }
    if (!this.closed) {
      this.closed = true;
      this.props.debug && debug("request.abort aborting request");
      this.transport.cancel();
    } else {
      throw new Error("Client already closed - cannot .close()");
    }
  }
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
