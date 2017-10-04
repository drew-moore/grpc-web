# grpc.client

`grpc.client` allows making any type of gRPC request and exposes a client for the request that can be used to send multiple messages and attach callbacks to the request's lifecycle.


## API Docs:
```typescript
grpc.client(methodDescriptor: MethodDescriptor, props: ClientRpcOptions): Client;
```

`methodDescriptor` is a generated method definition ([see code generation](TODO)).

#### `ClientRpcOptions`:

* `host: string`
  * The server address (`"https://example.com:9100"`)
* `transport?: TransportConstructor`
  * (optional) A function to build a `Transport` that will be used for the request. If no transport is specified then a browser-compatible transport will be used. See [transport](TODO). 
* `debug?: boolean`
  * if `true`, debug information will be printed to the console

#### `Client`:
```typescript
start(metadata?: grpc.Metadata): void;
send(message: grpc.ProtobufMessage): void;
close(): void;

onHeaders(callback: (headers: grpc.Metadata) => void): void;
onMessage(callback: (response: grpc.ProtobufMessage) => void): void;
onEnd(callback: (code: grpc.Code, message: string, trailers: grpc.Metadata) => void): void;
``` 

## Example:
```typescript
const request = new QueryBooksRequest();
request.setAuthorPrefix("Geor");

const client = grpc.client(BookService.QueryBooks, {
  host: "https://example.com:9100",
});
client.onHeaders((headers: grpc.Metadata) => {
  console.log("onHeaders", headers);
});
client.onMessage((message: Book) => {
  console.log("onMessage", message);
});
client.onEnd((status: grpc.Code, statusMessage: string, trailers: grpc.Metadata) => {
  console.log("onEnd", status, statusMessage, trailers);
});

client.start(new grpc.Metadata({"HeaderTestKey1": "ClientValue1"}));
client.send(request);
```