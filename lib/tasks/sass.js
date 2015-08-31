let $ = require('gulp-load-plugins')();

module.exports = () => (
  $.sass().on('error', (error) => {
    let message = new $.util.PluginError('sass', error.messageFormatted).toString();
    $.util.log(message);
    sass.emit('end');
  })
);
