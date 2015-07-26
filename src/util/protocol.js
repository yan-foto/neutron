// This is for future reference and cannot be used because of this bug:
// https://github.com/atom/electron/issues/2345

module.exports = {
  intercept: function() {
    let protocol = require('protocol');
    protocol.interceptProtocol('file', function(request) {
      let url = request.url;
      url = url.substring(url.indexOf('dist')).substring(5);

      return new protocol.RequestHttpJob({
        url: 'http://localhost:3000/' + url
      });
    });
  }
}
