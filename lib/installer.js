'use strict';

const path = require('path');
const npm = require('npm');
// Promise2 so it doesn't get confused with the global Promise
const Promise2 = require('bluebird');

const config = require(path.resolve(__dirname, '..', 'package.json'));

module.exports = (packages) => {
  packages = Array.isArray(packages) ? packages : new Array(packages);
  let load = Promise2.promisify(npm.load);

  return new Promise((fullfil, reject) => {
    load(config)
    .then(instance => {
      instance.config.set('save-dev', true);
      instance.commands.install(packages, fullfil);
    })
    .catch(reject);
  });
};
