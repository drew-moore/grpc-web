// Shared Karma configuration

var fs = require("fs");

module.exports = function(useHttps, withSauceLabs) {
  function configPreprocessor(args, config, logger, helper) {
    return function(content, file, done) {
      var envContent = 'window.USE_HTTPS = ' + useHttps + ';';
      done(envContent + '\n' + content);
    };
  }

  var reporters = ['dots'];
  if (withSauceLabs) {
    reporters.push('saucelabs');
  }

  return {
    basePath: '',
    frameworks: ['jasmine'],
    sauceLabs: {
      recordScreenshots: false,
      avoidProxy: true,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      },
      public: 'public'
    },
    files: [
      'ts/build/integration-tests.js'
    ],
    preprocessors: {
      '**/*.js': ['sourcemap', 'config-inject']
    },
    reporters: reporters,
    port: 9876,
    protocol: useHttps ? "https" : "http",
    httpsServerOptions: {
      key: fs.readFileSync('../misc/localhost.key', 'utf8'),
      cert: fs.readFileSync('../misc/localhost.crt', 'utf8')
    },
    colors: true,
    client: {
      captureConsole: true,
      runInParent: true,
      useIframe: false
    },
    plugins: [
      {'preprocessor:config-inject': ['factory', configPreprocessor]},
      "karma-sourcemap-loader",
      "karma-sauce-launcher",
      "karma-jasmine"
    ],
    autoWatch: true,
    captureTimeout: 120000,
    singlerun: withSauceLabs,
    concurrency: withSauceLabs ? 3 : Math.Infinity
  };
};
