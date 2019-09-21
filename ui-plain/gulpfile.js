const { src, dest, parallel, series } = require('gulp');
const concat = require('gulp-concat');
const scss = require('gulp-sass');
// const { appendText, prependText } = require('gulp-append-prepend');
const { resolve } = require('path');
const clean = require('gulp-clean');
const flatten = require('gulp-flatten');


// function js() {
//   const globs = [
//     makePath('src/common.blocks/**/*.script.js')
//   ];

//   return src(globs)
//     .pipe(concat('script.js'))
//     .pipe(prependText('document.addEventListener(\'DOMContentLoaded\', () => {'))
//     .pipe(appendText('});'))
//     .pipe(dest(makePath('build')));
// }

// function templateEngineJS() {
//   return src(makePath('src/common.blocks/template-engine/template-engine.js'))
//     .pipe(concat('template-engine.js'))
//     .pipe(dest(makePath('build')));
// }

function cleanDist() {
  return src('dist', { read: false })
    .pipe(clean());
}

function copyImages() {
  const files = [
    'src/common.blocks/**/*.svg',
  ];

  return src(files)
    .pipe(flatten())
    .pipe(dest('dist/img'));
}

function copyFonts() {
  return src('fonts/*.*')
    .pipe(flatten())
    .pipe(dest('dist/fonts'));
}

function css() {
  return src('src/common.blocks/**/*.scss')
    .pipe(scss().on('error', scss.logError))
    // .pipe(src(makePath('src/common.blocks/**/*.css')))
    .pipe(concat('style.css'))
    .pipe(dest('dist'));
}

module.exports = {
  // build: parallel(templateEngineJS, js, css)
  build: series(cleanDist, copyImages, copyFonts, css)
};