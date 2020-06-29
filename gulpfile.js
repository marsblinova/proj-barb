const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cleancss = require('gulp-clean-css');

function browsersync() {
  browserSync.init({
    server: {baseDir: 'src/'},
    notify: false,
    online: true
  })
}

function styles() {
  return src('src/scss/**/*.scss')
  .pipe(sass())
  .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
  .pipe(cleancss({ level: { 1: { specialComments: 0 }}, format: 'beautify' }))
  .pipe(dest('src/css'))
  .pipe(cleancss({ level: { 1: { specialComments: 0 }}, }))
  .pipe(concat('styles.min.css'))
  .pipe(dest('src/css'))
  .pipe(browserSync.stream())
}

function startwatch() {
  watch('src/**/*.html').on('change', browserSync.reload);
  watch('src/scss/**/*.scss', styles);
}

exports.server = browsersync;
exports.styles = styles;

exports.default = parallel(styles, browsersync, startwatch);





