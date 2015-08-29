let $ = require('gulp-load-plugins')();

let sass = $.sass().on('error', (error) => {
  let message = new $.util.PluginError('sass', error.messageFormatted).toString();
  $.util.log(message);
  sass.emit('end');
});

module.exports = () => sass;
