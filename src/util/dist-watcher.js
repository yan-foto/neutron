let chokidar = require('chokidar');

module.exports = function(mainWindow) {
  let env = process.env.ELECTRON_ENV || 'production';

  // Do nothing in production mode
  if (env !== "development") {
    return;
  }

  chokidar.watch('dist', {
    ignored: /[\/\\]\./
  }).on('change', function(path) {
    console.log('Updated: ', path);
    mainWindow.webContents.reloadIgnoringCache();
  });
};
