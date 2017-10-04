import {BrowserHeaders} from "browser-headers";
import * as impTransport from "./transports/Transport";
import * as impCode from "./Code";
import * as impInvoke from "./invoke";
import * as impUnary from "./unary";
import * as impClient from "./client";
import * as impService from "./service";
import {ProtobufMessage} from "./message";

export namespace grpc {
  export interface Transport extends impTransport.TransportConstructor{}
  export type TransportOptions = impTransport.TransportOptions;
  export const DefaultTransportFactory = impTransport.DefaultTransportFactory;
  
  export type UnaryMethodDefinition<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage> = impService.UnaryMethodDefinition<TRequest, TResponse>;
  export type MethodDefinition<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage> = impService.MethodDefinition<TRequest, TResponse>;
  export type ServiceDefinition = impService.ServiceDefinition;

  export import Code = impCode.Code;
  export import Metadata = BrowserHeaders;

  export const invoke = impInvoke.invoke;
  export type Request = impInvoke.Request;

  export const unary = impUnary.unary;
  export type UnaryRpcOptions<M extends UnaryMethodDefinition<TRequest, TResponse>, TRequest extends ProtobufMessage, TResponse extends ProtobufMessage> = impUnary.UnaryRpcOptions<M, TRequest, TResponse>;

  export const client = impClient.client;
  export type ClientRpcOptions<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage> = impClient.ClientRpcOptions<TRequest, TResponse>;
}
