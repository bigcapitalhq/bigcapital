const gulp = require('gulp');
const sass = require('sass');
const gulpSass = require('gulp-sass')(sass); // Gulp pluign for Sass compilation.
const mergeStream = require('merge-stream');
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