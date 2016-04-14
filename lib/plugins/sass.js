'use strict';

const $ = require('gulp-load-plugins')();

const Plugin = require('../plugin');
const installer = require('../installer');

module.exports = class extends Plugin {
  install() {
    return installer('gulp-sass');
  }

  getTask(config) {
    let sass = $.sass({
      includePaths: config.dependencies.sass.includePaths
    }).on('error', error => {
      let message = new $.util.PluginError(
        'sass', error.messageFormatted).toString();
      $.util.log(message);
      sass.emit('end');
    });

    return sass;
  }
};
