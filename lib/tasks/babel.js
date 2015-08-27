module.exports = function() {
  let $ = require('gulp-load-plugins')();
  let du = require('../dep-utils');
  let gulp = require('gulp');

  du.addToBuild('babel');

  return () => {
    let babel = $.babel().on('error', (error) => {
      let message = new $.util.PluginError('babel', error).toString();
      $.util.log(message);
      babel.emit('end');
    });

    return gulp.src(du.srcGlob('babel'))
      .pipe(babel)
      .pipe(gulp.dest('dist'));
  };
};
