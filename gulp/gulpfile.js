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
	return gulp.src('./app/html/*.html')
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
		.pipe(gulp.dest('./app/'))
	callback();
})


gulp.task('scss', (callback) => {
	return gulp.src('./app/scss/main.scss')
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
		.pipe(gulp.dest('./app/css/'))
	callback();
})


gulp.task('watch', () => {
	watch(['./app/*.html', './app/css/**/*.css'], gulp.parallel(browserSync.reload));

	watch(['./app/*.html', './app/scss/**/*.scss'], function(){
		setTimeout(gulp.parallel('scss'), 500);
	})

	watch(['./app/html/**/*.html'], gulp.parallel('html'))
})


gulp.task('server', () => {
	browserSync.init({
		server: {
			baseDir: './app/'	
		}
	})	 
})


gulp.task('default', gulp.parallel('watch', 'server', 'scss', 'html'))