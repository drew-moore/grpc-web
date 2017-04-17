var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var wd = require('wd');
var colors = require('colors');
var browserstack = require('browserstack-local');

chai.use(chaiAsPromised);
chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

wd.addPromiseChainMethod(
  'onQuit', function(done) {
    if(done) done();
    return this;
  }
);

const username = process.env.BROWSER_STACK_USERNAME;
const accessKey = process.env.BROWSER_STACK_ACCESS_KEY;
const tunnelIdentifier = "tunnel-" + Math.random();
console.log("tunnelIdentifier", tunnelIdentifier);

var config = {
  user: username,
  key: accessKey,
  seleniumHost: 'hub-cloud.browserstack.com',
  seleniumPort: 80,
  capabilities: [{
    browserName: 'ie',
    browserVersion: 10,
    acceptSslCerts: true,
    defaultVideo: true,
    "browserstack.local": true,
    "browserstack.tunnel": true,
    "browserstack.debug": true,
    tunnelIdentifier: tunnelIdentifier,
    "browserstack.localIdentifier": tunnelIdentifier,
  }]
};

var test = {
  name: 'BrowserStack Local Testing',
  run : function (browser) {
    return browser
      .get("http://localhost:9090")
      .sleep(2000)
      .get("http://localhost:9095")
      .sleep(2000)
      .get("https://localhost:9100")
      .sleep(2000)
      .get("https://localhost:9105")
      .sleep(2000)
      .get("https://localhost:9876")
      .sleep(120000);
  }
};

function runOnBrowserStack(caps, test, done){
  console.log("Running Test: " + test.name.green + '\n');
  var browser = wd.promiseChainRemote(config.seleniumHost, config.seleniumPort, username, accessKey);

  // optional extra logging
  browser.on('status', function(info) {
    console.log(info.cyan);
  });
  browser.on('command', function(eventType, command, response) {
    console.log(' > ' + eventType.green, command, (response || '').grey);
  });
  browser.on('http', function(meth, path, data) {
    console.log(' > ' + meth.yellow, path, (data || '').grey);
  });

  test.run(browser.init(caps)).fin(function() {
    return browser.quit();
  }).onQuit(done).done();
}

for(var i in config.capabilities){
  var caps = config.capabilities[i];
  // Code to start browserstack local before start of test and stop browserstack local after end of test
  console.log("Connecting local");
  var bs_local = new browserstack.Local();
  bs_local.start({'key': accessKey, 'localIdentifier': tunnelIdentifier }, function(error) {
    if (error) return console.log(error.red);
    console.log('Connected. Now testing...');

    runOnBrowserStack(caps, test, function(){
      bs_local.stop(function(){
        console.log("Stopped local tunnel");
      });
    });
  });
}
