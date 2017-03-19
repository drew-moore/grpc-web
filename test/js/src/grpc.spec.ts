import {
  grpc,
  BrowserHeaders,
} from "../../../js/src/index";
import {
  Empty,
} from "google-protobuf/google/protobuf/empty_pb";
import {
  PingRequest,
  PingResponse,
} from "../_proto/mwitkow/grpcweb/test/test_pb";
import {
  TestService,
  FailService,
} from "../services";
import {
  deepEqual,
  ok,
  equal,
} from "assert";

declare function describe(name: string, test: () => void): void;
declare function it(name: string, test: (done: () => void) => void): void;

describe("grpc-web", () => {
  it("should make a unary request", (done) => {
    let didGetOnHeaders = false;
    let didGetOnMessage = false;
    let didGetOnError = false;

    const ping = new PingRequest();
    ping.setValue("hello world");

    grpc.invoke(TestService.Ping, {
      request: ping,
      host: "https://localhost:9090",
      onHeaders: function(headers: BrowserHeaders) {
        didGetOnHeaders = true;
        deepEqual(headers.get("HeaderTestKey1"), ["Value1"]);
        deepEqual(headers.get("HeaderTestKey2"), ["Value2"]);
      },
      onMessage: function(message: PingResponse) {
        didGetOnMessage = true;
        deepEqual(message.getValue(), "hello world");
      },
      onError: function(err: Error) {
        didGetOnError = true;
      },
      onComplete: function(code: grpc.Code, msg: string | undefined, trailers: BrowserHeaders) {
        equal(code, grpc.Code.OK, "expected OK (0)");
        equal(msg, undefined, "expected no message");
        deepEqual(trailers.get("TrailerTestKey1"), ["Value1"]);
        deepEqual(trailers.get("TrailerTestKey2"), ["Value2"]);
        ok(didGetOnHeaders);
        ok(didGetOnMessage);
        ok(!didGetOnError);
        done();
      }
    });
  });

  it("should handle a streaming response of multiple messages", (done) => {
    let didGetOnHeaders = false;
    let onMessageId = 0;
    let didGetOnError = false;

    const ping = new PingRequest();
    ping.setValue("hello world");
    ping.setResponseCount(3000);

    grpc.invoke(TestService.PingList, {
      request: ping,
      host: "https://localhost:9090",
      onHeaders: function(headers: BrowserHeaders) {
        didGetOnHeaders = true;
        deepEqual(headers.get("HeaderTestKey1"), ["Value1"]);
        deepEqual(headers.get("HeaderTestKey2"), ["Value2"]);
      },
      onMessage: function(message: PingResponse) {
        equal(message.getCounter(), onMessageId++);
      },
      onError: function(err: Error) {
        didGetOnError = true;
      },
      onComplete: function(code: grpc.Code, msg: string | undefined, trailers: BrowserHeaders) {
        equal(code, grpc.Code.OK, "expected OK (0)");
        equal(msg, undefined, "expected no message");
        deepEqual(trailers.get("TrailerTestKey1"), ["Value1"]);
        deepEqual(trailers.get("TrailerTestKey2"), ["Value2"]);
        ok(didGetOnHeaders);
        equal(onMessageId, 3000);
        ok(!didGetOnError);
        done();
      }
    });
  });

  it("should handle a streaming response of no messages", (done) => {
    let didGetOnHeaders = false;
    let onMessageId = 0;
    let didGetOnError = false;

    const ping = new PingRequest();
    ping.setValue("hello world");
    ping.setResponseCount(0);

    grpc.invoke(TestService.PingList, {
      request: ping,
      host: "https://localhost:9090",
      onHeaders: function(headers: BrowserHeaders) {
        didGetOnHeaders = true;
        deepEqual(headers.get("HeaderTestKey1"), ["Value1"]);
        deepEqual(headers.get("HeaderTestKey2"), ["Value2"]);
      },
      onMessage: function(message: PingResponse) {
        equal(message.getCounter(), onMessageId++);
      },
      onError: function(err: Error) {
        didGetOnError = true;
      },
      onComplete: function(code: grpc.Code, msg: string | undefined, trailers: BrowserHeaders) {
        equal(code, grpc.Code.OK, "expected OK (0)");
        equal(msg, undefined, "expected no message");
        deepEqual(trailers.get("TrailerTestKey1"), ["Value1"]);
        deepEqual(trailers.get("TrailerTestKey2"), ["Value2"]);
        ok(didGetOnHeaders);
        equal(onMessageId, 0);
        ok(!didGetOnError);
        done();
      }
    });
  });

  it("should report failure", (done) => {
    let didGetOnHeaders = false;
    let didGetOnMessage = false;
    let didGetOnError = false;

    const ping = new PingRequest();
    ping.setFailureType(PingRequest.FailureType.CODE);
    ping.setErrorCodeReturned(12);

    grpc.invoke(TestService.PingError, {
      request: ping,
      host: "https://localhost:9090",
      onHeaders: function(headers: BrowserHeaders) {
        didGetOnHeaders = true;
      },
      onMessage: function(message: Empty) {
        didGetOnMessage = true;
      },
      onError: function(err: Error) {
        didGetOnError = true;
      },
      onComplete: function(code: grpc.Code, msg: string, trailers: BrowserHeaders) {
        deepEqual(trailers.get("grpc-status"), ["12"]);
        deepEqual(trailers.get("grpc-message"), ["Intentionally returning error for PingError"]);
        equal(code, 12);
        equal(msg, "Intentionally returning error for PingError");
        ok(didGetOnHeaders);
        ok(!didGetOnMessage);
        ok(!didGetOnError);
        done();
      }
    });
  });

  it("should report failure for a trailers-only response", (done) => {
    let didGetOnHeaders = false;
    let didGetOnMessage = false;
    let didGetOnError = false;

    const ping = new PingRequest();

    grpc.invoke(FailService.NonExistant, { // The test server hasn't registered this service
      request: ping,
      host: "https://localhost:9090",
      onHeaders: function(headers: BrowserHeaders) {
        didGetOnHeaders = true;
        deepEqual(headers.get("grpc-status"), ["12"]);
        deepEqual(headers.get("grpc-message"), ["unknown method /mwitkow.grpcweb.test.FailService/NonExistant"]);
      },
      onMessage: function(message: Empty) {
        didGetOnMessage = true;
      },
      onError: function(err: Error) {
        didGetOnError = true;
      },
      onComplete: function(code: grpc.Code, msg: string, trailers: BrowserHeaders) {
        deepEqual(trailers.get("grpc-status"), ["12"]);
        deepEqual(trailers.get("grpc-message"), ["unknown method /mwitkow.grpcweb.test.FailService/NonExistant"]);
        equal(code, 12);
        equal(msg, "unknown method /mwitkow.grpcweb.test.FailService/NonExistant");
        ok(didGetOnHeaders);
        ok(!didGetOnMessage);
        ok(!didGetOnError);
        done();
      }
    });
  });

  it("should report failure for a dropped response after headers", (done) => {
    let didGetOnHeaders = false;
    let didGetOnMessage = false;
    let didGetOnComplete = false;

    const ping = new PingRequest();
    ping.setFailureType(PingRequest.FailureType.DROP);

    grpc.invoke(TestService.PingError, {
      request: ping,
      host: "https://localhost:9090",
      onHeaders: function (headers: BrowserHeaders) {
        didGetOnHeaders = true;
        deepEqual(headers.get("grpc-status"), []);
        deepEqual(headers.get("grpc-message"), []);
      },
      onMessage: function (message: Empty) {
        didGetOnMessage = true;
      },
      onError: function (err: Error) {
        equal(err.message, "Response closed without grpc-status");
        ok(didGetOnHeaders);
        ok(!didGetOnMessage);
        ok(!didGetOnComplete);
        done();
      },
      onComplete: function (code: grpc.Code, msg: string, trailers: BrowserHeaders) {
        didGetOnComplete = true;
      }
    });
  });

  it("should report failure for a request to an invalid host", (done) => {
    let didGetOnHeaders = false;
    let didGetOnMessage = false;
    let didGetOnComplete = false;

    const ping = new PingRequest();
    ping.setFailureType(PingRequest.FailureType.DROP);

    grpc.invoke(TestService.PingError, {
      request: ping,
      host: "https://localhost:9999", // Should not be available
      onHeaders: function (headers: BrowserHeaders) {
        didGetOnHeaders = true;
      },
      onMessage: function (message: Empty) {
        didGetOnMessage = true;
      },
      onError: function (err: Error) {
        equal(err.message, "Response closed without headers");
        ok(!didGetOnHeaders);
        ok(!didGetOnMessage);
        ok(!didGetOnComplete);
        done();
      },
      onComplete: function (code: grpc.Code, msg: string, trailers: BrowserHeaders) {
        didGetOnComplete = true;
      }
    });
  });
});
