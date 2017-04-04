#!/usr/bin/env bash
set -e
set -x

function killGoTestServer {
  echo "Killing Go Test server..."
  kill ${SERVER_PID} &> /dev/null
  exit 1
}

echo "Starting Go Test server..."
./go/build/testserver --tls_cert_file=../misc/localhost.crt --tls_key_file=../misc/localhost.key &
SERVER_PID=$!

# Check the Go Test server started up ok.
sleep 0.5
ps ${SERVER_PID} &> /dev/null

# Kill the Go Test server when this script exists or is interrupted.
trap killGoTestServer SIGINT
trap killGoTestServer EXIT

./node_modules/.bin/karma start ./http.karma.conf.js $@

./node_modules/.bin/karma start ./https.karma.conf.js $@
