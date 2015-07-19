'use strict';
var pkg = require('./package.json');

var banner = '/**\n' +
      ' * <%= pkg.description %>\n' +
      ' * @version v<%= pkg.version %>\n' +
      ' * @link <%= pkg.homepage %>\n' +
      ' * @author <%= pkg.author %>\n' +
      ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
      ' */\n\n';

var gulp = require('gulp'),
    karma = require('karma').server,
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    ghPages = require('gulp-gh-pages'),
    header = require('gulp-header');

gulp.task('scripts', function() {
  gulp.src([
      'src/*.js',
      'src/directives/*.js',
      'src/services/*.js'
    ])
    .pipe(replace(/'use strict';/g, ''))
    .pipe(concat('pure-modal.js'))
    .pipe(header(banner, { pkg: pkg } ))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(rename('pure-modal.min.js'))
    .pipe(header(banner, { pkg: pkg } ))
    .pipe(gulp.dest('./dist'));
});

gulp.task('styles', function() {
  return gulp.src('src/less/pure-modal.less')
    .pipe(less())
    .pipe(header(banner, { pkg: pkg } ))
    .pipe(gulp.dest('dist/'))
    .pipe(rename({suffix: '.min'} ))
    .pipe(minifycss())
    .pipe(header(banner, { pkg: pkg } ))
    .pipe(gulp.dest('dist/'));
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('deploy-pages', function() {
  return gulp.src(['./dist/**/*', './demo/**/*', 'index.html', 'README.md'], { cdw: './', base: './' })
    .pipe(ghPages());
});

gulp.task('lint-src', function() {
  return gulp.src([ 'src/**/*.js' ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint-tests', function() {
  return gulp.src([ 'test/**/*Spec.js' ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['lint-src', 'test', 'scripts', 'styles']);

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['lint-src', 'scripts']);
  gulp.watch('test/**/*.spec.js', ['lint-tests', 'test']);

  gulp.watch('src/less/**/*.less', ['styles']);
});