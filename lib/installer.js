module.exports = function(rootDir, packages, cb) {
  var path = require('path');
  var npm = require('npm');
  var config = require(path.join(rootDir, 'package.json'));

  npm.load(config, function(err, instance) {
    npm.config.set('save-dev', true);
    npm.commands.install(packages, cb);
  });
};
