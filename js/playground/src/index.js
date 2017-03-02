import * as grpc from './grpc-polyfill';
import { TestServiceService } from './_proto/mwitkow/grpcweb/test/test_grpc_pb';

const container = document.getElementById("container");

// Constructing the request
const req = new proto.mwitkow.grpcweb.test.PingRequest();
req.setValue('hello');
req.setErrorCodeReturned(2);

const TestServiceClient = grpc.makeGenericClientConstructor(TestServiceService);

// Make a unary request
const client = new TestServiceClient('https://localhost:9090');
client.ping(req, {
  onMessage: function(message) {
    console.log("ping.onMessage", message);
  },
  onError: function(err) {
    console.log("ping.onError", err);
  },
  onHeaders: function(headers, status) {
    console.log("ping onHeaders", headers, status);
    headers.forEach((header, value) => {
      console.log("header",header, value);
    });
  },
  onComplete: function(resp) {
    console.log("ping complete", resp);

    client.pingError(req, {
      onMessage: function(message) {
        // console.log("ping.onMessage", message);
      },
      onError: function(err) {
        console.log("pingError.onError", err);
      },
      onHeaders: function(headers, status) {
        console.log("pingError onHeaders", headers, status);
        headers.forEach((header, value) => {
          console.log("header",header, value);
        });
      },
      onComplete: function(resp) {
        console.log("pingError complete", resp);

        // Make a server-streaming request
        client.pingList(req, {
          onMessage: function (message) {
            // console.log("pingList.onMessage", message);
          },
          onError: function (err) {
            console.log("pingList.onError", err);
          },
          onHeaders: function (headers) {
            console.log("pingList onHeaders", headers);
            console.log("pingList.headers", headers.entries());
          },
          onComplete: function (resp) {
            console.log("pingList complete", resp);
          }
        });
      }
    });
  }
});
