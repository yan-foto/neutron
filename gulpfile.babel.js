'use strict';

let gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let mainBowerFiles = require('main-bower-files');
let path = require('path');
let fs = require('fs');
let del = require('del');
let spawn = require('child_process').spawn;
let electron = require('electron-prebuilt');
let config = JSON.parse(fs.readFileSync('./.neutronrc'));

// Prepare sources
let sources = {};
Object.keys(config.sources).forEach(function(type) {
  sources[type] = config.sources[type].map((src) =>
    config.baseDir + '/**/*.' + src
  );
  sources[type].push('!' + config.baseDir + '/node_modules/**');
});
sources.bower = 'bower.json';

gulp.task('jshint', () =>
  gulp.src(sources.scripts.concat('gulpfile.js'))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'))
);

gulp.task('jscs', () =>
  gulp.src(sources.scripts.concat('gulpfile.js'))
    .pipe($.jscs())
    .pipe($.jshint.reporter('fail'))
);

gulp.task('scripts', () =>
  gulp.src(sources.scripts)
    .pipe($.babel())
    .pipe(gulp.dest('dist'))
);

gulp.task('jade', () =>
  gulp.src(sources.views)
    .pipe($.jade())
    .pipe(gulp.dest('dist'))
);

gulp.task('styles', () =>
  gulp.src(sources.styles)
    .pipe($.sass().on('error', console.error.bind(console, 'Sass error:')))
    .pipe(gulp.dest('dist'))
);

gulp.task('fonts', () =>
  gulp.src(sources.fonts)
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
  if (fs.existsSync(sources.bower)) {
    return gulp.src(mainBowerFiles('**/*.js'))
      .pipe(gulp.dest(path.join('dist', 'js')));
  }
});

gulp.task('bower-css-assets', () => {
  if (fs.existsSync(sources.bower)) {
    return gulp.src(mainBowerFiles('**/*.css'))
      .pipe(gulp.dest(path.join('dist', 'css')));
  }
});

gulp.task('bower-font-assets', () => {
  if (fs.existsSync(sources.bower)) {
    let glob = config.sources.fonts.map((ext) => {return '**/*.' + ext;});
    return gulp.src(mainBowerFiles(glob))
      .pipe(gulp.dest(path.join('dist', 'fonts')));
  }
});

gulp.task('clean', (cb) => {
  del(['dist/**/*', 'package/', '!dist/package.json']);
});

gulp.task('watch', ['build'], () => {
  gulp.watch(sources.views, ['jade']);
  gulp.watch(sources.scripts, ['scripts']);
  gulp.watch(sources.styles, ['styles']);
  gulp.watch(sources.bower, ['bower-assets']);
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
  try {
    let asar = require('asar');
    let pkg = require('./dist/package.json');

    asar.createPackage(
      './dist/',
      './package/'+pkg.name+'.asar',
      cb
    );
  } catch (e) {
    $.util.log('Error while creating asar package!', e);
    cb(e);
  }
});

gulp.task('bower-assets', ['bower-css-assets', 'bower-js-assets', 'bower-font-assets']);

gulp.task('lint', ['jshint', 'jscs']);

gulp.task('build', ['bower-assets', 'styles', 'jade', 'scripts']);
