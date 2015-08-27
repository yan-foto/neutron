module.exports = function() {
  let $ = require('gulp-load-plugins')();
  let du = require('../dep-utils');
  let gulp = require('gulp');

  du.addToBuild('jade');

  return () => (
    gulp.src(du.srcGlob('jade'))
      .pipe($.jade())
      .pipe(gulp.dest('dist'))
  );
};
