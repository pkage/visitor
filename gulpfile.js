var gulp = require('gulp')
var scss = require('gulp-sass')
var rename = require('gulp-rename');

var errCatch = function(err) {
	console.log(err.toString());
	this.emit('end');
}

gulp.task('build', function() {
	return gulp.src('scss/main.scss')
		.pipe(scss())
		.on('err', errCatch)
		.pipe(rename('main.css'))
		.pipe(gulp.dest('assets/css/'))
})

gulp.task('watch', function() {
	gulp.watch('scss/*', ['build']);
})

gulp.task('default', ['build', 'watch']);
