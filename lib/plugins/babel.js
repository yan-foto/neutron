'use strict';

const $ = require('gulp-load-plugins')();
const path = require('path');
const Promise2 = require('bluebird');

const Plugin = require('../plugin');
const installer = require('../installer');

module.exports = class extends Plugin {
  install() {
    return installer(['babel-core', 'gulp-babel', 'babel-preset-es2015']);
  }

  configure() {
    let target = path.join(path.resolve(__dirname, '..', '..'), '.babelrc');
    let content = {presets: ['es2015']};

    // Create .babelrc file
    let writeFile = Promise2.promisify(require('fs').writeFile);
    return writeFile(target, JSON.stringify(content, null, 4));
  }

  getTask() {
    let babel = $.babel().on('error', error => {
      let message = new $.util.PluginError('babel', error).toString();
      $.util.log(message);
      babel.emit('end');
    });

    return babel;
  }
};
