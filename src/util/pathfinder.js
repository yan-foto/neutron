let u = require('url');

module.exports = function(url) {
  let env = process.env.ELECTRON_ENV || 'production';
  let protocol = u.parse(url).protocol;
  let index = url.indexOf('dist');

  if (env === 'development' && protocol === 'file:' && index > -1) {
    let path = url.substring(index).substring(5);
    return 'http://localhost:3000/' + path;
  } else {
    // Nothing to do!
    return url;
  }
}
