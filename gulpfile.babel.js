let gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let mainBowerFiles = require('main-bower-files');
let path = require('path');
let fs = require('fs');
let del = require('del');
let spawn = require('child_process').spawn;
let electron = require('electron-prebuilt');

let config = JSON.parse(fs.readFileSync(path.join(__dirname, '.neutronrc')));
let du = require('./lib/dep-utils');
let deps = config.dependencies;

// Helper function to DRY things up!
let toTarget = subDir => {
  let target = subDir ? path.join(config.targetDir, subDir) : config.targetDir;
  return gulp.dest(target);
};

// Import corresponding tasks
Object.keys(deps).forEach((task) => {
  let t = require('./lib/tasks/' + task);

  gulp.task(task, () => (
    gulp.src(du.srcGlob(task))
      .pipe(t(config))
      .pipe(gulp.dest(config.targetDir))
  ));
});

gulp.task('jscs', () => (
  gulp.src([`${config.baseDir}/**/*.js`, 'gulpfile.babel.js', 'lib/**/*.js'])
    .pipe($.jscs())
    .pipe($.jshint.reporter('fail'))
));

gulp.task('jshint', () => (
  gulp.src([`${config.baseDir}/**/*.js`, 'gulpfile.babel.js', 'lib/**/*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'))
));

gulp.task('bootstrap', () => {
  // Install required packages
  let packages = Object.keys(deps).map((item) => 'gulp-' + item);
  $.util.log('Trying to install packages:', $.util.colors.cyan(packages.join(', ')));
  return require('./lib/installer')(packages);
});

gulp.task('statics', () => {
  let statics = [];
  Object.keys(config.statics).forEach(key => {
    let globs = config.statics[key].map(ext => `${config.baseDir}/**/*.${ext}`);
    statics = statics.concat(globs);
  });

  return gulp.src(statics)
    .pipe(toTarget());
});

gulp.task('electron-manifest', () => {
  let pkg = require('./package.json');

  $.file('package.json', JSON.stringify({
    name: pkg.name,
    version: pkg.version,
    main: 'main.js'
  }, null, 2), {src: true}).pipe(toTarget());
});

gulp.task('bower-js-assets', () => {
  if (fs.existsSync('bower.json')) {
    return gulp.src(mainBowerFiles('**/*.js'))
      .pipe(toTarget('js'));
  }
});

gulp.task('bower-css-assets', () => {
  if (fs.existsSync('bower.json')) {
    return gulp.src(mainBowerFiles('**/*.css'))
      .pipe(toTarget('css'));
  }
});

// Create bower static assets
let bowerStaticTasks = [];
if (fs.existsSync('bower.json')) {
  Object.keys(config.statics).forEach(key => {
    let taskName = 'bower-static:' + key;

    gulp.task(taskName, () => {
      let globs = config.statics[key].map(ext => '/**/*.' + ext);
      return gulp.src(mainBowerFiles(globs))
        .pipe(toTarget(key));
    });

    bowerStaticTasks.push(taskName);
  });
}
gulp.task('bower-static-assets', bowerStaticTasks);

gulp.task('clean', (cb) => {
  let defaults = [`${config.targetDir}/**/*`, 'package/', `!${config.targetDir}/package.json`];
  let userDefined = config.cleanIgnore.map((path) => `!${config.targetDir}/${path}`);

  del(defaults.concat(userDefined));
});

gulp.task('watch', ['build'], () => {
  Object.keys(deps).forEach((task) => {
    gulp.watch(du.srcGlob(task), [task]);
  });
});

gulp.task('start', ['watch'], () => {
  let env = process.env;
  env.ELECTRON_ENV = 'development';
  env.NODE_PATH = path.join(__dirname, config.targetDir, 'node_modules');

  let e = spawn(electron, [config.targetDir], {
    env: env
  });

  e.stdout.on('data', (data) => {
    $.util.log(data.toString().trim());
  });

  e.stderr.on('data', (data) => {
    $.util.log($.util.colors.red(data.toString().trim()));
  });
});

gulp.task('package', ['build'], (cb) => {
  var packager = require('electron-packager');
  packager(config.packager, (err, appPath) => {
    if (err) {
      $.util.log('Error while creating the package!', err);
    } else {
      cb();
    }
  });
});

gulp.task('bower-assets', ['bower-css-assets', 'bower-js-assets', 'bower-static-assets']);

gulp.task('lint', ['jscs', 'jshint']);

gulp.task('build', Object.keys(deps).concat('bower-assets', 'statics'));
