var config = require('./config.json');
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var cache =require('gulp-cache');
var del =require('del');
var runSequence = require('run-sequence');
var minifyHtml = require('gulp-minify-html');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var usemin = require('gulp-usemin');
var minifyCss = require('gulp-minify-css');

gulp.task('sass', function() {
  return gulp.src(config.base.src + config.path.sass + config.files.sassAll)
  .pipe(sass())
  .pipe(gulp.dest(config.base.build + config.path.css))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('minify-html', function(){
  var opts ={
    comments: true
  }

  return gulp.src(config.base.src + config.path.views + config.files.html)
  .pipe(minifyHtml(opts))
  .pipe(gulp.dest(config.base.build))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function() {
  return gulp.src(config.base.src + config.path.js + config.files.js)
  .pipe(uglify())
  .pipe(gulp.dest(config.base.build + config.path.js))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('jshint', function() {
  return gulp.src(config.base.src + config.path.js + config.files.js)
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
});

gulp.task('imagemin', function(){
  return gulp.src(config.base.src + config.path.images + config.files.images )
  .pipe(imagemin())
  .pipe(gulp.dest(config.base.build + config.path.images))
});

gulp.task('concatjs', function(){
  return gulp.src(config.vendor.js)
  .pipe(concat('libs.js'))
  .pipe(gulp.dest(config.base.build + config.path.js))
});

gulp.task('usemin', function(){
  var opts = {
    css: [ minifyCss, 'concat'],
    js: [ uglify, 'concat']
  }
  return gulp.src(config.base.src + config.path.views + config.files.html)
  .pipe(usemin(opts))
  .pipe(gulp.dest(config.base.build))
});

gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  })
});


gulp.task('watch', function(){
  gulp.watch(config.base.src + config.path.sass + config.files.sassAll, ['sass']);
  gulp.watch(config.base.src + config.path.js + config.files.js, ['js']);
  gulp.watch(config.base.src + config.path.views + config.files.html, ['minify-html', 'usemin']);
  gulp.watch(config.base.src + config.path.images + config.files.images, ['imagemin']);
});

gulp.task('clean', function (cb) {
  return del(config.base.build, cb);
});

gulp.task('copy', function (cb) {
  return gulp.src(config.base.src + config.path.views + config.files.html)
  .pipe(gulp.dest(config.base.build))
});

gulp.task('default', function(cb){
  runSequence('clean', [ 'copy','usemin', 'browserSync', 'sass', 'imagemin', 'concatjs', 'watch'], cb)
});
