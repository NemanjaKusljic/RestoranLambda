var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var sassLint = require('gulp-sass-lint');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var concat = require('gulp-concat');

//copy html to dist
gulp.task('html', function() {
    return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'))
  })
  
  //copy img to dist
  gulp.task('copy-images', function() {
    return gulp.src('app/images/**/*')
    .pipe(gulp.dest('dist/images'))
  })
  
  //copy fonts to dist folder
  gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
  })
  
  //optimization of js files
  
  gulp.task('useref', function(){
    return gulp.src('app/js/*.js')
      .pipe(concat('main.min.js'))
       .pipe(useref())
      // Minifies only if it's a JavaScript file
       //.pipe(gulpIf('*.js', uglify()))
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('dist/js'))
  });
  
  
  // css to scss
  gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
  });
  
  //sass linting
  gulp.task('sass-lint', function () {
    return gulp.src('app/scss/*.scss')
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
  });
  
  // initial task for build
  gulp.task('initial', gulp.series('html', 'copy-images', 'fonts', 'sass', 'useref'));
  
  //  Server + watching scss files + scss linting
  gulp.task('serve', gulp.series('sass', function() {
  
    browserSync.init({
        server: "./dist/"
    });
  
    gulp.watch("app/scss/*.scss", gulp.series('sass-lint'));
    gulp.watch("app/scss/*.scss", gulp.series('sass'));
    gulp.watch("app/scss/*.scss", gulp.series('copy-images'));
    gulp.watch("app/*.html", gulp.series('html'));
    gulp.watch("app/*.html").on('change', browserSync.reload);
  
    gulp.watch('app/js/*.js', gulp.series('useref')); //update js files on change
    gulp.watch('app/js/*.js', browserSync.reload); //update js files on change
  }));
  
  gulp.task('starter', gulp.series('serve'));
  
  
  // generate iconfonts
  
  
  var fontName = 'iconsfont';
  
  gulp.task('iconfont', function(){
    return gulp.src(['app/icons/*.svg'])
      .pipe(iconfontCss({
        fontName: fontName,
      }))
      .pipe(iconfont({
        fontName: fontName,
        prependUnicode: false, // recommended option
        formats: ['woff2', 'woff', 'ttf'], // default, 'woff2' and 'svg' are available
        normalize: true,
        fontHeight: 1001,
        centerHorizontally: true
       }))
      .pipe(gulp.dest('dist/fonts/'));
  });