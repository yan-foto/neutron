module.exports = function() {
  let $ = require('gulp-load-plugins')();
  let du = require('../dep-utils');
  let gulp = require('gulp');

  du.addToLint('jshint');

  return () => (
    gulp.src(du.srcGlob('jshint').concat('gulpfile.babel.js', 'lib/**/*.js'))
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe($.jshint.reporter('fail'))
  );
};
