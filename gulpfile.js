const {src, dest, watch, parallel, series} = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const svgSprite = require('gulp-svg-sprite');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const path = require('path');
const rename = require('gulp-rename');
const flatten = require('gulp-flatten');

function html() {
 return src('app/**/*.html')
   .pipe(fileinclude({
     prefix: '@@',
     basepath: '@file'
   }))
   .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true
   }))
   .pipe(dest('dist'))
   .pipe(browserSync.stream());
}

function indexHtml() {
 return src('app/index.html')
   .pipe(fileinclude({
     prefix: '@@',
     basepath: '@file'
   }))
   .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true
   }))
   .pipe(dest('dist'))
   .pipe(browserSync.stream());
}

function scripts() {
 return src('app/js/main.js')
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('dist/js'))
  .pipe(browserSync.stream())
}

function styles() {
 return src('app/scss/style.scss')
   .pipe(sass().on('error', sass.logError))
   .pipe(autoprefixer())
   .pipe(concat('style.css'))
   .pipe(cleanCss())
   .pipe(dest('dist/css'))
   .pipe(browserSync.stream());
}

function images() {
 return src('app/images/**/*')
   .pipe(newer('dist/images'))
   .pipe(imagemin())
   .pipe(flatten({ includeParents: 1 }))
   .pipe(dest('dist/images'))
   .pipe(webp())
   .pipe(rename({ extname: '.webp' }))
   .pipe(dest('dist/images'))
   .pipe(browserSync.stream());
}

function sprite() {
 return src('app/images/*.*/*.svg')
  .pipe(svgSprite({
   mode: {
    stack: {
     sprite: '../sprite.svg',
     example: true
    }
   }
  }))
  .pipe(dest('app/images/dist'))
}

function fonts() {
 return src('app/fonts/*.*')
  .pipe(fonter({
   formats: ['woff', 'ttf']
  }))
  .pipe(src('app/fonts/*.ttf'))
  .pipe(ttf2woff2())
  .pipe(dest('dist/fonts'))
}

function watching() {
 watch(['app/*.html'], html);
 watch(['app/scss/**/*.scss'], styles);
 watch(['app/js/main.js'], scripts)
 watch(['app/images/**/*'], images)
 watch(['app/**/*.html'], html).on('change', browserSync.reload);
}

function browsersync() {
 browserSync.init({
  server: {
   baseDir: "dist"
  },
  files: [
   'dist/**/*',
 ],
 });
}

function cleanDist() {
 return src('dist')
 .pipe(clean())
}

function building() {
 return src([
  'app/js/main.min.js',
  'app/*.html',
  'app/images/*.*',
  '!app/images/dist/*.svg',
  'app/fonts/*.*'
 ], {base: 'app'})
 .pipe(dest('dist'))
}

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.sprite = sprite;
exports.cleanDist = cleanDist;
exports.building = building;
exports.watching = watching;
exports.browsersync = browsersync;


exports.build = series(cleanDist, building, styles);
exports.building = series(cleanDist, parallel(styles, scripts, images, fonts, sprite, html, indexHtml, styles));
exports.default = parallel(styles, scripts, html, images, fonts, browsersync, watching);