'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var mainBowerFiles = require('main-bower-files');
var path = require('path');
var fs = require('fs');
var del = require('del');
var spawn = require('child_process').spawn;
var electron = require('electron-prebuilt');

var sources = {
  scripts: 'src/**/*.js',
  views: 'src/**/*.jade',
  styles: 'src/**/*.{scss,css}',
  fonts: 'src/**/*.{eot, ttf, woff, woff2}',
  bower: 'bower.json'
};

gulp.task('jshint', function() {
  return gulp.src([sources.scripts , 'gulpfile.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src([sources.scripts , 'gulpfile.js'])
    .pipe($.jscs())
    .pipe($.jshint.reporter('fail'));
});

gulp.task('scripts', function() {
  return gulp.src(sources.scripts)
    .pipe($.babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('jade', function() {
  return gulp.src(sources.views)
    .pipe($.jade())
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
  return gulp.src(sources.styles)
    .pipe($.sass().on('error', console.error.bind(console, 'Sass error:')))
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function() {
  return gulp.src(sources.fonts)
    .pipe(gulp.dest('dist'));
});

gulp.task('electron-manifest', function() {
  var pkg = require('./package.json');

  return $.file('package.json', JSON.stringify({
    name: pkg.name,
    version: pkg.version,
    main: 'main.js'
  }, null, 2), {src: true}).pipe(gulp.dest('dist'));
});

gulp.task('bower-js-assets', function() {
  if (fs.existsSync(sources.bower)) {
    return gulp.src(mainBowerFiles('**/*.js'))
      .pipe(gulp.dest(path.join('dist', 'js')));
  }
});

gulp.task('bower-css-assets', function() {
  if (fs.existsSync(sources.bower)) {
    return gulp.src(mainBowerFiles('**/*.css'))
      .pipe(gulp.dest(path.join('dist', 'css')));
  }
});

gulp.task('bower-font-assets', function() {
  if (fs.existsSync(sources.bower)) {
    return gulp.src(mainBowerFiles(['**/*.eot', '**/*.ttf', '**/*.woff', '**/*.woff2']))
      .pipe(gulp.dest(path.join('dist', 'fonts')));
  }
});

gulp.task('clean', function(cb) {
  del(['dist/**/*', '!dist/package.json']);
});

gulp.task('watch', ['build'], function() {
  gulp.watch(sources.views, ['jade']);
  gulp.watch(sources.scripts, ['scripts']);
  gulp.watch(sources.styles, ['styles']);
  gulp.watch(sources.bower, ['bower-assets']);
});

gulp.task('start', ['watch'], function() {
  var env = process.env;
  env.ELECTRON_ENV = 'development';
  env.NODE_PATH = path.join(__dirname, 'dist', 'node_modules');

  var e = spawn(electron, ['dist'], {
    env: env
  });

  e.stdout.on('data', function(data) {
    $.util.log(data.toString().trim());
  });

  e.stderr.on('data', function(data) {
    $.util.log($.util.colors.red(data.toString().trim()));
  });
});

gulp.task('bower-assets', ['bower-css-assets', 'bower-js-assets', 'bower-font-assets']);

gulp.task('lint', ['jshint', 'jscs']);

gulp.task('build', ['bower-assets', 'styles', 'jade', 'scripts']);
