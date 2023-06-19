const gulp = require('gulp');
const sass = require('sass');
const gulpSass = require('gulp-sass')(sass); // Gulp plugin for Sass compilation.
const mergeStream = require('merge-stream');

const rename = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css

// Style related.
const postcss = require('gulp-postcss'); // Transforming styles with JS plugins
const rtlcss = require('rtlcss'); // Convert LTR CSS to RTL.

const config = require('./gulpConfig');

gulp.task('styles', () => {
  const builds = config.style.build.map((build) => {
    return gulp
      .src(build.src)
      .pipe(gulpSass(config.style.sass))
      .pipe(gulp.dest(build.dest));
  });
  return mergeStream(builds);
});

/**
 * Task: `styles-rtl`
 *
 * This task does the following.
 *  1. Gets the source css files.
 *  2. Covert LTR CSS to RTL.
 *  3. Suffix all CSS files to `-rtl`.
 *  4. Reloads css files via browser sync stream.
 *  5. Combine matching media queries for `.min.css` version.
 *  6. Minify all CSS files.
 *  7. Reload minified css files via browser sync stream.
 */
gulp.task('styles-rtl', () => {
  const builds = config.style.rtl.map((build) => {
    return gulp
      .src(build.src)
      .pipe(
        postcss([
          rtlcss(config.style.rtlcss), // Convert LTR CSS to RTL.
        ]),
      )
      .pipe(rename({ suffix: '-rtl' })) // Append "-rtl" to the filename.
      .pipe(gulp.dest(build.dest));
  });

  return mergeStream(builds);
});
