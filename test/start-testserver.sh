#!/usr/bin/env bash
set -e
set -x

cd "$(dirname "$0")"

go build -o ./go/build/testserver ./go/testserver/testserver.go

function killGoTestServer {
  echo "Killing Go Test server..."
  kill ${SERVER_PID} &> /dev/null
}

echo "Starting Go Test server..."
./go/build/testserver --tls_cert_file=../misc/localhost.crt --tls_key_file=../misc/localhost.key &
SERVER_PID=$!

# Kill the Go Test server when this script exits or is interrupted.
trap killGoTestServer SIGINT
trap killGoTestServer EXIT

wait
