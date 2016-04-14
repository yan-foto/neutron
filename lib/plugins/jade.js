'use strict';

const $ = require('gulp-load-plugins')();

const Plugin = require('../plugin');
const installer = require('../installer');

module.exports = class extends Plugin {
  install() {
    return installer('gulp-jade');
  }

  getTask() {
    return $.jade({pretty: true});
  }
};
