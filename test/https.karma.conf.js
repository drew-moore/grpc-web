// Https Karma configuration - for browsers that support https on SauceLabs

var sharedConfigGenerator = require("./shared-karma-conf.js");

var fs = require("fs");
module.exports = function(config) {
  var customLaunchers = {
    'SL_Chrome_Latest': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'OS X 10.12'
    },
    'SL_Chrome_48': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'OS X 10.12',
      version: '48'
    },
    'SL_Chrome_41': { // Fetch support added in Chrome 42
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'OS X 10.12',
      version: '41'
    },
    'SL_Firefox_Latest': {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'OS X 10.12'
    },
    'SL_Firefox_52': {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'OS X 10.12',
      version: '52'
    },
    'SL_Firefox_38': { // Fetch support added in Firefox 39
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'OS X 10.12',
      version: '38'
    }
  };

  var browsers = [];
  if (process.env.SAUCE_USERNAME) {
    Array.prototype.push.apply(browsers, Object.keys(customLaunchers));
  }

  var settings = sharedConfigGenerator(true, process.env.SAUCE_USERNAME !== undefined);
  console.log("settings", settings);
  settings.browsers = browsers;
  settings.customLaunchers = customLaunchers;

  config.set(settings)
};
