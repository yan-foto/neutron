module.exports = function() {
  let $ = require('gulp-load-plugins')();
  let du = require('../dep-utils');
  let gulp = require('gulp');

  du.addToLint('jscs');

  return () => (
    gulp.src(du.srcGlob('jscs').concat('gulpfile.babel.js', 'lib/**/*.js'))
      .pipe($.jscs())
      .pipe($.jshint.reporter('fail'))
  );
};
