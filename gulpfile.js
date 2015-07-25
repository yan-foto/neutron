'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var mainBowerFiles = require('main-bower-files');
var path = require('path');

gulp.task('jshint', function() {
  return gulp.src(['src/**/*.js' , 'gulpfile.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src(['src/**/*.js' , 'gulpfile.js'])
    .pipe($.jscs())
    .pipe($.jshint.reporter('fail'));
});

gulp.task('babel', function() {
  return gulp.src('src/**/*.js')
    .pipe($.babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('jade', function() {
  return gulp.src('src/**/*.jade')
    .pipe($.jade())
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
  return gulp.src(mainBowerFiles('**/*.js'))
    .pipe(gulp.dest(path.join('dist', 'js')));
});

gulp.task('bower-css-assets', function() {
  return gulp.src(mainBowerFiles('**/*.css'))
    .pipe(gulp.dest(path.join('dist', 'css')));
});

gulp.task('bower-assets', ['bower-css-assets', 'bower-js-assets']);

gulp.task('lint', ['jshint', 'jscs']);
