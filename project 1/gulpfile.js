const gulp = require('gulp');
const browserSync = require('browser-sync');
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fileinclude = require('gulp-file-include');


gulp.task('html', (callback) => {
	return gulp.src('./src/html/*.html')
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'HTML include',
					sound: true,
					message: err.message
				}
			})	
		}))
		.pipe(fileinclude({ prefix: '@@' }))
		.pipe(gulp.dest('./dist/'))
	callback();
})


gulp.task('scss', (callback) => {
	return gulp.src('./src/scss/main.scss')
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
					sound: true,
					message: err.message
				}
			})	
		}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 4 versions']	
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/css/'))
	callback();
})


gulp.task('copy:img', (callback) => {
	return gulp.src('./src/images/**/*.*')
		.pipe(gulp.dest('./dist/images/'))
})


gulp.task('copy:upload', (callback) => {
	return gulp.src('./src/upload/**/*.*')
		.pipe(gulp.dest('./dist/upload/'))
})


gulp.task('copy:js', (callback) => {
	return gulp.src('./src/js/**/*.*')
		.pipe(gulp.dest('./dist/js/'))
})


gulp.task('watch', () => {
	watch(['./src/html/*.html', './src/css/**/*.css'], gulp.parallel(browserSync.reload));

	watch(['./src/html/*.html', './src/scss/**/*.scss'], function(){
		setTimeout(gulp.parallel('scss'), 1000);
	})

	watch(['./src/html/**/*.html'], gulp.parallel('html'))

	watch(['./src/images/**/*.*'], gulp.parallel('copy:img'))
	watch(['./src/js/**/*.*'], gulp.parallel('copy:js'))
	watch(['./src/upload/**/*.*'], gulp.parallel('copy:upload'))
})


gulp.task('server', () => {
	browserSync.init({
		server: {
			baseDir: './dist/'	
		}
	})	 
})


gulp.task(
	'default', 
	gulp.series(
		gulp.parallel('scss', 'html', 'copy:img', 'copy:upload', 'copy:js'),
		gulp.parallel('server', 'watch')
	)
)