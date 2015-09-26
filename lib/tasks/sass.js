let $ = require('gulp-load-plugins')();

module.exports = (config) => {
  let sass = $.sass({
    includePaths: config.dependencies.sass.includePaths
  }).on('error', (error) => {
    let message = new $.util.PluginError('sass', error.messageFormatted).toString();
    $.util.log(message);
    sass.emit('end');
  });

  return sass;
};
