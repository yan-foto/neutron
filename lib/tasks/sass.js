module.exports = function() {
  let $ = require('gulp-load-plugins')();
  let du = require('../dep-utils');
  let gulp = require('gulp');

  du.addToBuild('sass');

  return () => {
    let sass = $.sass().on('error', (error) => {
      let message = new $.util.PluginError('sass', error.messageFormatted).toString();
      $.util.log(message);
      sass.emit('end');
    });

    return gulp.src(du.srcGlob('sass'))
      .pipe(sass)
      .pipe(gulp.dest('dist'));
  };
};
