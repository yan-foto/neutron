'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

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

gulp.task('lint', ['jshint', 'jscs']);
