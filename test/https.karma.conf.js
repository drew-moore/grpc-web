// Https Karma configuration - for browsers that support https on BrowserStack

var sharedConfigGenerator = require("./shared-karma-conf.js");

var fs = require("fs");
module.exports = function(config) {
  var customLaunchers = {
    bs_firefox_mac: {
      base: 'BrowserStack',
      browser: 'firefox',
      browser_version: '52.0',
      os: 'OS X',
      os_version: 'Sierra'
    },
    // 'SL_Chrome_Latest': {
    //   base: 'SauceLabs',
    //   browserName: 'chrome',
    //   platform: 'OS X 10.12'
    // },
    // 'SL_Chrome_48': {
    //   base: 'SauceLabs',
    //   browserName: 'chrome',
    //   platform: 'OS X 10.12',
    //   version: '48'
    // },
    // 'SL_Chrome_41': { // Fetch support added in Chrome 42
    //   base: 'SauceLabs',
    //   browserName: 'chrome',
    //   platform: 'OS X 10.12',
    //   version: '41'
    // },
    // 'SL_Firefox_Latest': {
    //   base: 'SauceLabs',
    //   browserName: 'firefox',
    //   platform: 'OS X 10.12'
    // },
    // 'SL_Firefox_52': {
    //   base: 'SauceLabs',
    //   browserName: 'firefox',
    //   platform: 'OS X 10.12',
    //   version: '52'
    // },
    // 'SL_Firefox_38': { // Fetch support added in Firefox 39
    //   base: 'SauceLabs',
    //   browserName: 'firefox',
    //   platform: 'OS X 10.12',
    //   version: '38'
    // }
  };

  var browsers = [];
  const useBrowserStack = process.env.BROWSER_STACK_USERNAME !== undefined;

  if (useBrowserStack) {
    Array.prototype.push.apply(browsers, Object.keys(customLaunchers));
  }

  var settings = sharedConfigGenerator(true, useBrowserStack);
  console.log("settings", settings);
  settings.browsers = browsers;
  settings.customLaunchers = customLaunchers;

  config.set(settings)
};
