'use strict';
var gulp = require('gulp');
var browserify = require ('browserify');
var source = require('vinyl-source-stream'); //necessary to make browserfiy return an stream gulp can understand
var reactify = require('reactify');//to convert FJX to JS
var del = require('del');//to delete files
var watchify = require('watchify');// to trigger tasks when something changes
var runSequence = require('run-sequence'); // to run task syncronusly
var gutil = require('gulp-util');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

//browserify & watchify options
var options = 
{
    entries: ['./src/main.js'],
    transform: ['reactify'],
    debug: true,
    cache: {},//for watchify
    packageCache: {}//for watchify
};
var b = browserify(options);
var w = watchify(b);
w.plugin('minifyify', {
            map: 'bundle.js.map',
            output: 'public/bundle.js.map',
            compress: { // Options passed to Uglify
                drop_debugger: true,
                drop_console: true
            }
        })


function bundle ()
{
    return w.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public'))
}

//converts JSX to JS, wraps all modules in single file in /public/bundle.js
gulp.task('compile', bundle); 

gulp.task('default', function cb ()
{
    //runSequence('clean',['less','compile','copy'],cb);//runs clean first and compile and copy in parallel
    runSequence('clean','copy','compile',cb);

});

w.on('update', function () {
    gutil.log('File changed, compiling...');
    bundle();
    gutil.log('Compiled.');
});
//w.on('log', gutil.log);


//deletes the /public directory
gulp.task('clean', function(done) {
  del(['public'], done);
});

//copy all html and css from /src to /public
gulp.task('copy', function(done) {
  gulp.src(['./src/*.html','./img/*', './src/*.css'], {})
  .pipe(gulp.dest('./public'));
});

//LESS
gulp.task('less', function() {

  return gulp.src('./src/styles.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer({cascade: false, browsers: ['last 2 versions']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public'));
});