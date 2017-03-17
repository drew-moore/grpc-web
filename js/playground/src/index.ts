import * as grpc from "../../lib/src/index";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import {
  PingRequest,
  // PingResponse
} from "./_proto/mwitkow/grpcweb/test/test_pb";
import {
  // TestService,
  FailService
} from "./services";

const req = new PingRequest();
req.setValue("hello");
req.setErrorCodeReturned(2);

// const empty = new Empty();

// doPing();
//
// function doPing() {
//   // Make a unary request
//   grpc.invoke(TestService.Ping, {
//     req: req,
//     host: "https://localhost:9090",
//     onMessage: function(message: PingResponse) {
//       console.log("doPing.onMessage", message.getCounter());
//     },
//     onError: function(err: Error) {
//       console.log("doPing.onError", err);
//     },
//     onHeaders: function(headers: grpc.BrowserHeaders) {
//       console.log("doPing.onHeaders", headers);
//       headers.forEach((header, value) => {
//         console.log("doPing.header", header, value);
//       });
//     },
//     onComplete: function(code: grpc.Code, msg: string, resp: grpc.BrowserHeaders) {
//       console.log("doPing complete", code, msg, resp);
//       doPingErrorDrop();
//     }
//   });
// }

// doPingErrorCode();
//
// function doPingErrorCode() {
//   const pingError = new PingRequest();
//   pingError.setFailureType(PingRequest.FailureType.CODE);
//   pingError.setErrorCodeReturned(13);
//   grpc.invoke(TestService.PingError, {
//     req: pingError,
//     host: "https://localhost:9090",
//     onMessage: function(message: Empty) {
//       console.log("doPingErrorCode.onMessage", message);
//     },
//     onError: function(err: Error) {
//       console.log("doPingErrorCode.onError", err);
//     },
//     onHeaders: function(headers: grpc.BrowserHeaders) {
//       console.log("doPingErrorCode.onHeaders", headers);
//       headers.forEach((header, value) => {
//         console.log("doPingErrorCode.header", header, value);
//       });
//     },
//     onComplete: function(code: grpc.Code, msg: string, resp: grpc.BrowserHeaders) {
//       console.log("doPingErrorCode complete", code, msg, resp);
//       // doPingErrorDrop();
//     }
//   });
// }


// doPingErrorDrop();
//
// function doPingErrorDrop() {
//   const ping = new PingRequest();
//   ping.setFailureType(PingRequest.FailureType.DROP);
//   grpc.invoke(TestService.PingError, {
//     req: ping,
//     host: "https://localhost:9090",
//     onMessage: function(message: Empty) {
//       console.log("doPingErrorDrop.onMessage", message);
//     },
//     onError: function(err: Error) {
//       console.log("doPingErrorDrop.onError", err);
//     },
//     onHeaders: function(headers: grpc.BrowserHeaders) {
//       console.log("doPingErrorDrop.onHeaders", headers);
//       headers.forEach((header, value) => {
//         console.log("doPingErrorDrop.header", header, value);
//       });
//     },
//     onComplete: function(code: grpc.Code, msg: string, resp: grpc.BrowserHeaders) {
//       console.log("doPingErrorDrop complete", code, msg, resp);
//
//       // doPingErrorListDrop();
//     }
//   });
// }



doPingFailService();

function doPingFailService() {
  const ping = new PingRequest();
  grpc.invoke(FailService.NonExistant, { // The server hasn't registered this service
    req: ping,
    host: "https://localhost:9090",
    onMessage: function(message: Empty) {
      console.log("doPingErrorDrop.onMessage", message);
    },
    onError: function(err: Error) {
      console.log("doPingErrorDrop.onError", err);
    },
    onHeaders: function(headers: grpc.BrowserHeaders) {
      console.log("doPingErrorDrop.onHeaders", headers);
      headers.forEach((header, value) => {
        console.log("doPingErrorDrop.header", header, value);
      });
    },
    onComplete: function(code: grpc.Code, msg: string, resp: grpc.BrowserHeaders) {
      console.log("doPingErrorDrop complete", code, msg, resp);

      // doPingErrorListDrop();
    }
  });
}

// function doPingErrorListDrop() {
//   const pingError = new PingRequest();
//   pingError.setFailureType(PingRequest.FailureType.DROP);
//   grpc.invoke(TestService.PingList, {
//     req: pingError,
//     host: "https://localhost:9090",
//     onMessage: function(message: Empty) {
//       console.log("doPingErrorListDrop.onMessage", message);
//     },
//     onError: function(err: Error) {
//       console.log("doPingErrorListDrop.onError", err);
//     },
//     onHeaders: function(headers: grpc.BrowserHeaders) {
//       console.log("doPingErrorListDrop.onHeaders", headers);
//       headers.forEach((header, value) => {
//         console.log("doPingErrorListDrop.header", header, value);
//       });
//     },
//     onComplete: function(code: grpc.Code, msg: string, resp: grpc.BrowserHeaders) {
//       console.log("doPingErrorListDrop complete", code, msg, resp);
//
//       // doPingErrorWrongHost();
//     }
//   });
// }

// function doPingErrorWrongHost() {
//   const pingError = new PingRequest();
//   pingError.setFailureType(PingRequest.FailureType.CODE);
//   pingError.setErrorCodeReturned(13);
//   grpc.invoke(TestService.PingError, {
//     req: pingError,
//     host: "https://localhost:9999",
//     onMessage: function(message: Empty) {
//       console.log("pingError.onMessage", message);
//     },
//     onError: function(err: Error) {
//       console.log("pingError.onError", err);
//     },
//     onHeaders: function(headers: grpc.BrowserHeaders) {
//       console.log("pingError.onHeaders", headers);
//       headers.forEach((header, value) => {
//         console.log("pingError.header", header, value);
//       });
//     },
//     onComplete: function(code: grpc.Code, msg: string, resp: grpc.BrowserHeaders) {
//       console.log("pingError complete", code, msg, resp);

//       doPingList();
//     }
//   });
// }

// function doPingList() {
//   // Make a server-streaming request
//   grpc.invoke(TestService.PingList, {
//     req: empty,
//     host: "https://localhost:9090",
//     onMessage: function (message: PingResponse) {
//       console.log("pingList.onMessage", message);
//     },
//     onError: function (err: Error) {
//       console.log("pingList.onError", err);
//     },
//     onHeaders: function(headers: grpc.BrowserHeaders) {
//       console.log("pingList.onHeaders", headers);
//       headers.forEach((header, value) => {
//         console.log("pingList.header", header, value);
//       });
//     },
//     onComplete: function (resp) {
//       console.log("pingList complete", code, msg, resp);
//     }
//   });
// }