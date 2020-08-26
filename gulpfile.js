const { src, dest, parallel, series, watch } = require('gulp');
const server = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const del = require('del');
const newer = require('gulp-newer');
//const plumber = require('gulp-plumber');

function serve() {
  server.init({
    server: {baseDir: 'build/'},
    notify: false,
    online: true
  })
  watch('src/scss/**/*.scss', styles);
  watch(['src/**/*.js', '!src/**/*.min.js'], scripts);
  watch('src/**/*.html').on('change', server.reload);
}

function styles() {
  return src('src/scss/**/*.scss')
  //.pipe(plumber())
  .pipe(sass())
  .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
  .pipe(cleancss({ level: { 1: { specialComments: 0 }}, format: 'beautify' }))
  .pipe(dest('build/css'))
  .pipe(cleancss({ level: { 1: { specialComments: 0 }}, }))
  .pipe(concat('styles.min.css'))
  .pipe(dest('build/css'))
  .pipe(server.stream())
}

function scripts() {
  return src('src/js/main.js')
  .pipe(concat('scripts.min.js'))
  .pipe(uglify())
  .pipe(dest('build/js/'))
  .pipe(server.stream())
}

function images() {
  return src('src/img/**/*.{png, jpg, svg}')
  .pipe(newer('src/img/**/*.{png, jpg, svg}'))
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),

    imagemin.svgo()
  ]))
  .pipe(dest('src/img'))
}

function webP() {
  return src('src/img/**/*.{!svg}')
  .pipe(webp({quality: 90}))
  .pipe(dest('src/img'))
}

function sprite() {
  return src('src/img/login.svg')
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(concat('sprite.svg'))
  .pipe(dest('build/img'))
}

function html() {
  return src('src/*.html')
  .pipe(posthtml([
    include()
  ]))
  .pipe(dest('build'))
  .pipe(server.stream())
}


function startwatch() {
  watch('src/**/*.html').on('change', server.reload);
  watch('src/scss/**/*.scss', styles);
  watch(['src/**/*.js', '!src/**/*.min.js'], scripts);
}

function copy() {
  return src([
    'src/fonts/**/*.{woff, woff2}',
    'src/img/**',
    'src/js/**'
  ], {
    base: 'src'
  })
  .pipe(dest('build'));
}

function clean() {
  return del('build');
}

exports.serve = serve;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.webp = webP;
exports.sprite = sprite;
exports.html = html;
exports.copy = copy;
exports.clean = clean;

exports.default = parallel(styles, scripts, images, webp, serve, startwatch);

exports.build = series(clean, copy, styles, scripts, sprite, html, serve);




