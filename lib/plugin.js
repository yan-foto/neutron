'use strict';

let $ = require('gulp-load-plugins')();

/** Class representing a neutron plugin */
module.exports = class {
    /**
     * Plugin should install all dependencies (if any) in this function.
     *
     * @return {Promise} a promise which is resolved after done
     */
    install() {
      return Promise.resolve();
    }

    /**
     * Plugin should make all configurations (creating files, etc) in this
     * function. It is called after #install is resolved.
     *
     * @return {Promise} a promise which is resolved after done
     */
    configure() {
      return Promise.resolve();
    }

    /**
     * @return {stream.Writable} actual plugin stream to pipe files through
     */
    getTask() {
      return $.util.noop();
    }
};
