#!/usr/bin/env bash
set -e
set -x

function killGrpcWebServer {
  echo "Killing GrpcWeb Server..."
  kill ${SERVER_PID} &> /dev/null
}

echo "Starting GrpcWeb Server..."
go build ../go/demoserver/demoserver.go
./demoserver &
SERVER_PID=$!

# Check the GrpcWeb server started up ok.
sleep 0.5
ps ${SERVER_PID} &> /dev/null

# Kill the GrpcWeb server when this script exists.
trap killGrpcWebServer EXIT

./node_modules/.bin/karma start $@
