let fs = require('fs');
let path = require('path');
let parentPath = path.resolve(__dirname, '..');
let config = JSON.parse(fs.readFileSync(path.join(parentPath, '.neutronrc')));
let deps = config.dependencies;

exports.srcGlob = function(dep) {
  if (!Object.keys(deps).includes(dep)) {
    return [];
  }

  let sources = deps[dep].map((src) => config.baseDir + '/**/*.' + src);
  sources.push('!' + config.baseDir + '/node_modules/**');

  return sources;
};
