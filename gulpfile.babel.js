'use strict';

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

// Prepare statics
let statics = config.statics.map((ext) => config.baseDir + '/**/*.' + ext);

// Import corresponding tasks
Object.keys(deps).forEach((task) => {
  gulp.task(task, require('./lib/tasks/' + task)());
});

gulp.task('bootstrap', (cb) => {
  // Install required packages
  let packages = Object.keys(deps).map((item) => 'gulp-' + item);
  $.util.log('Trying to install packages:', $.util.colors.cyan(packages.join(', ')));
  require('./lib/installer')(__dirname, packages, cb);
});

gulp.task('statics', () =>
  gulp.src(statics)
    .pipe(gulp.dest('dist'))
);

gulp.task('electron-manifest', () => {
  let pkg = require('./package.json');

  $.file('package.json', JSON.stringify({
    name: pkg.name,
    version: pkg.version,
    main: 'main.js'
  }, null, 2), {src: true}).pipe(gulp.dest('dist'));
});

gulp.task('bower-js-assets', () => {
  if (fs.existsSync('bower.json')) {
    return gulp.src(mainBowerFiles('**/*.js'))
      .pipe(gulp.dest(path.join('dist', 'js')));
  }
});

gulp.task('bower-css-assets', () => {
  if (fs.existsSync('bower.json')) {
    return gulp.src(mainBowerFiles('**/*.css'))
      .pipe(gulp.dest(path.join('dist', 'css')));
  }
});

gulp.task('bower-static-assets', () => {
  if (fs.existsSync('bower.json')) {
    return gulp.src(mainBowerFiles(statics))
      .pipe(gulp.dest(path.join('dist', 'fonts')));
  }
});

gulp.task('clean', (cb) => {
  del(['dist/**/*', 'package/', '!dist/package.json']);
});

gulp.task('watch', ['build'], () => {
  Object.keys(deps).forEach((task) => {
    gulp.watch(du.srcGlob(task), [task]);
  });
});

gulp.task('start', ['watch'], () => {
  let env = process.env;
  env.ELECTRON_ENV = 'development';
  env.NODE_PATH = path.join(__dirname, 'dist', 'node_modules');

  let e = spawn(electron, ['dist'], {
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

gulp.task('lint', du.lintTasks);

gulp.task('build', du.buildTasks.concat('bower-assets', 'statics'));
