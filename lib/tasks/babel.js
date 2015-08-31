let $ = require('gulp-load-plugins')();

module.exports = () => (
  $.babel().on('error', (error) => {
    let message = new $.util.PluginError('babel', error).toString();
    $.util.log(message);
    babel.emit('end');
  })
);
