const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');

const packages = {
  core: ts.createProject('packages/core/tsconfig.json'),
  cli: ts.createProject('packages/cli/tsconfig.json')
};
const modules = Object.keys(packages);
const source = 'packages';
const distId = process.argv.indexOf('--dist');
const dist = distId < 0 ? 'node_modules/@caroljs' : process.argv[distId + 1];

gulp.task('default', function() {
  modules.forEach(module => {
    gulp.watch(
      [`${source}/${module}/**/*.ts`, `${source}/${module}/*.ts`],
      [module],
    );
  });
});

gulp.task('copy:ts', function() {
  return gulp.src(['packages/**/*.ts']).pipe(gulp.dest('./bundle'));
});

gulp.task('copy-docs', function() {
  return gulp
    .src('Readme.md')
    .pipe(gulp.dest('bundle/core'))
    .pipe(gulp.dest('bundle/cli'));
});

gulp.task('clean:bundle', function() {
  return gulp
    .src(['bundle/**/*.js.map', 'bundle/**/*.ts', '!bundle/**/*.d.ts'], {
      read: false,
    })
    .pipe(clean());
});

modules.forEach(module => {
  gulp.task(module, () => {
    return packages[module]
      .src()
      .pipe(packages[module]())
      .pipe(gulp.dest(`${dist}/${module}`));
  });
});

modules.forEach(module => {
  gulp.task(module + ':dev', () => {
    return packages[module]
      .src()
      .pipe(sourcemaps.init())
      .pipe(packages[module]())
      .pipe(
        sourcemaps.mapSources(sourcePath => './' + sourcePath.split('/').pop()),
      )
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(`${dist}/${module}`));
  });
});

gulp.task('common', gulp.series(modules));

gulp.task(
  'cli:dev',
  gulp.series(modules.map(module => module + ':dev'), 'copy:ts'),
);

gulp.task('build', gulp.series('common'));

gulp.task('build:dev', gulp.series('cli:dev'));
