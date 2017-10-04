# gRPC-Web: TypeScript/JavaScript Usage Docs


## Install grpc-web-client

gRPC-Web is available as a npm package named `grpc-web-client`:

```
npm install grpc-web-client --save
```

This package contains the `grpc` namespace that includes client functions that allow making gRPC requests to grpc-web-compatible gRPC servers ([gRPC-Web requires a compatibility wrapper atop of standard gRPC](TODO)) 


## Code Generation

To make gRPC requests the client requires generated code for the service/method definitions and message classes that are [defined in `.proto` files](TODO).

[`protoc`](https://github.com/google/protobuf) is the google protobuf code generation tool. It can generate the JavaScript message classes and also supports using plugins for additional code generation.

This process is slightly different between TypeScript and JavaScript usage.

### TypeScript ([skip to JS](TODO))

[`ts-protoc-gen`](https://www.github.com/improbable-eng/ts-protoc-gen) is a package that can generate the `.d.ts` files that declare the contents of the protoc-generated JavaScript files. `ts-protoc-gen` can also generate `grpc-web-client` service/method definitions with the `protoc-gen-ts` plugin and `service=true` argument.

This is an example of a complete invokation of `protoc` with `ts-protoc-gen` assuming your `.proto` files are in a directory named `my-protos` within the current working directory:

```
protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--js_out=import_style=commonjs,binary:my-generated-code \
--ts_out=service=true:my-generated-code \
-I ./my-protos \
my-protos/*.proto
```

A proto file such as `book_service.proto`:

```syntax = "proto3";
   
   package examplecom.library;
   
   message Book {
     int64 isbn = 1;
     string title = 2;
     string author = 3;
   }
   
   message GetBookRequest {
     int64 isbn = 1;
   }
   
   service BookService {
     rpc GetBook(GetBookRequest) returns (Book) {}
   }
```

Will generate `book_service_pb.js`, `book_service_pb.d.ts` and `book_service_pb_service.ts`.

The first two files contain the message classes and `book_service_pb_service.ts` contains a `BookService.GetBook` class that acts as method definition that can be used with `grpc-web-client`.


### JavaScript

[`ts-protoc-gen`](https://www.github.com/improbable-eng/ts-protoc-gen) is a package that can generate `grpc-web-client` service/method definitions with the `protoc-gen-js_service` plugin and `js_service_out` argument.

This is an example of a complete invokation of `protoc` with `ts-protoc-gen` assuming your `.proto` files are in a directory named `my-protos` within the current working directory:

```
protoc \
--plugin=protoc-gen-js_service=./node_modules/.bin/protoc-gen-js_service \
--js_out=import_style=commonjs,binary:my-generated-code \
--js_service_out=my-generated-code \
-I ./my-protos \
my-protos/*.proto

```

A proto file such as `book_service.proto`:

```syntax = "proto3";
   
   package examplecom.library;
   
   message Book {
     int64 isbn = 1;
     string title = 2;
     string author = 3;
   }
   
   message GetBookRequest {
     int64 isbn = 1;
   }
   
   service BookService {
     rpc GetBook(GetBookRequest) returns (Book) {}
   }
```

Will generate `book_service_pb.js` and `book_service_pb_service.js`.

The first file contains the message classes and `book_service_pb_service.js` contains a `BookService.GetBook` class that acts as method definition that can be used with `grpc-web-client`.

## Making Requests

There are three functions for making gRPC requests:

### `grpc.unary`
This is a convenience function for making requests that consist of a single request message and single response message. It can only be used with unary methods.
```
rpc GetBook(GetBookRequest) returns (Book) {}
```

### `grpc.invoke`
This is a convenience function for making requests that consist of a single request message and a stream of response messages (server-streaming). It can also be used with unary methods.
```
rpc GetBook(GetBookRequest) returns (Book) {}
rpc QueryBooks(QueryBooksRequest) returns (stream Book) {}
```

### `grpc.client`
`grpc.client` returns a client. Dependant upon [transport compatibility](TODO) this client is capable of sending multiple request messages (client-streaming) and receiving multiple response messages (server-streaming). It can be used with any type of method, but will enforce limiting the sending of messages for unary methods.
```
rpc GetBook(GetBookRequest) returns (Book) {}
rpc QueryBooks(QueryBooksRequest) returns (stream Book) {}
rpc LogReadPages(stream PageRead) returns (google.protobuf.Empty) {}
rpc ListenForBooks(stream QueryBooksRequest) returns (stream Book) {} //TODO: Find a better example
```  
