// Http Karma configuration - for all browsers that are tested

var sharedConfigGenerator = require("./shared-karma-conf.js");

var fs = require("fs");
module.exports = function(config) {
  var customLaunchers = {
    'SL_Safari_Latest': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.12'
    }
  };

  var browsers = [];

  if (process.env.SAUCE_USERNAME) {
    Array.prototype.push.apply(browsers, Object.keys(customLaunchers));
  }

  var settings = sharedConfigGenerator(false, process.env.SAUCE_USERNAME !== undefined);

  settings.browsers = browsers;
  settings.customLaunchers = customLaunchers;

  config.set(settings)
};
