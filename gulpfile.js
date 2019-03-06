const gulp = require('gulp'),
		log = require('fancy-log'),
		compass = require('gulp-compass'),
		path = require('path'),
		connect = require('gulp-connect'),
		concat = require('gulp-concat'),
		replace = require('gulp-replace');

const sassSources = ['components/sass/style.scss'];
const htmlSources = ['development/*.html'];
const jsFinal = ['development/js/*.js'];

gulp.task('compass', function(done){
	gulp.src(sassSources)
	.pipe(compass({
		css: 'development/css',
		sass: path.normalize(__dirname+'/components/sass'),
		style: 'expanded',
		comments: true
	}))
	.on('error', console.log)
	.pipe(gulp.dest('development/css'))
	.pipe(connect.reload());
	done();
});

gulp.task('html', function(done){
	gulp.src(htmlSources)
	.pipe(connect.reload());
	done();
});

gulp.task('js', function(done){
	gulp.src(jsFinal)
	.pipe(connect.reload());
	done();
});

gulp.task('watch', function(){
	gulp.watch('components/sass/*.scss', gulp.series('compass'));
	gulp.watch(htmlSources, gulp.series('html'));
	gulp.watch(jsFinal, gulp.series('js'));
});

gulp.task('connect', function(){
	connect.server({
		root: 'development',
		livereload: true
	});
});

const seriesFunctions = gulp.series('html', 'js', 'compass');
const parallelFunctions = gulp.parallel('connect', 'watch');

gulp.task('all', gulp.series(seriesFunctions, parallelFunctions));
