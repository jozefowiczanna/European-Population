const gulp = require('gulp'),
		log = require('fancy-log'),
		compass = require('gulp-compass'),
		path = require('path'),
		connect = require('gulp-connect'),
		replace = require('gulp-replace');

const sassSources = ['development/sass/style.scss'];
const htmlSources = ['development/*.html'];
const jsSources = ['development/js/*.js'];

gulp.task('compass', function(done){
	gulp.src(sassSources)
	.pipe(compass({
		css: 'development/css',
		sass: path.normalize(__dirname+'/development/sass'),
		style: 'expanded',
		comments: true
	}))
	.on('error', log)
	.pipe(gulp.dest('development/css'))
	.pipe(connect.reload());
	done();
});

gulp.task('watch', function(){
	gulp.watch('development/sass/*.scss', gulp.parallel('compass'));
	gulp.watch(htmlSources, gulp.series('html'));
	gulp.watch(jsSources, gulp.series('js'));
});

gulp.task('connect', function(){
	connect.server({
		root: 'development',
		livereload: true
	});
});

gulp.task('html', function(done){
	gulp.src(htmlSources)
	.pipe(connect.reload());
	done();
})

gulp.task('js', function(done){
	gulp.src(jsSources)
	.pipe(connect.reload());
	done();
})

//temp function - need to create set of production functions
//I didn't want to move index.html file permamently
gulp.task('copy', function(done){
	//index.html file has to be in the main folder, but I don't want to mess with original file structure
	gulp.src('development/index.html')
  .pipe(gulp.dest('./'));

	//update links in the copied index.html file
	gulp.src('index.html')
    .pipe(replace('css/style.css', 'development/css/style.css'))
		.pipe(replace('js/script.js', 'development/script/script.js'))
		.pipe(gulp.dest('./'));
	done();
})

const seriesFunctions= gulp.series('html', 'js', 'compass');
const parallelFunctions = gulp.parallel('connect', 'watch');

gulp.task('all', gulp.series(seriesFunctions, parallelFunctions));
