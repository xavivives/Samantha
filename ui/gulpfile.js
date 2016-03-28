var config      = require('./gulpConfig');

//Utils

//bundlelogger

/* bundleLogger
   ------------
   Provides gulp style logs to the bundle method in browserify.js
*/

var gutil        = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var startTime;

var bundlelogger =
{
  start: function(filepath) {
    startTime = process.hrtime();
    gutil.log('Bundling', gutil.colors.green(filepath) + '...');
  },

  end: function(filepath) {
    var taskTime = process.hrtime(startTime);
    var prettyTime = prettyHrtime(taskTime);
    gutil.log('Bundled', gutil.colors.green(filepath), 'in', gutil.colors.magenta(prettyTime));
  }
};

var notify = require("gulp-notify");

var handleErrors = function() {

  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};

//Require
/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any files in that directory get
  automatically required below.
  To add a new task, simply add a new task file that directory.
  gulp/tasks/default.js specifies the default set of tasks to run
  when you run `gulp`.
*/

/*var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });
*/

//browser sync
var browserSync = require('browser-sync');
var gulp        = require('gulp');
//var config      = require('./gulpConfig').browserSync;

gulp.task('browserSync', ['build'], function() {
  browserSync(config.browserSync);
});


//browserify
/* browserify task
   ---------------
   Bundle javascripty things with browserify!
   This task is set up to generate multiple separate bundles, from
   different sources, and to use Watchify when run from the default task.
   See browserify.bundleConfigs in gulp/config.js
*/

var browserify   = require('browserify');
var watchify     = require('watchify');
//var bundleLogger = require('../util/bundleLogger');
var gulp         = require('gulp');
//var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
//var config       = require('./gulpConfig').browserify;
var babelify     = require('babelify');

gulp.task('browserify', function(callback) {

  var bundleQueue = config.browserify.bundleConfigs.length;

  var browserifyThis = function(bundleConfig) {

    var bundler = browserify({
      // Required watchify args
      cache: {}, packageCache: {}, fullPaths: false,
      // Specify the entry point of your app
      entries: bundleConfig.entries,
      // Add file extentions to make optional in your requires
      extensions: config.browserify.extensions,
      // Enable source maps!
      debug: config.browserify.debug
    });

    var bundle = function() {
      // Log when bundling starts
      //bundleLogger.start(bundleConfig.outputName);
      console.log("start: "+bundleConfig.outputName);
      return bundler
        .bundle()
        // Report compile errors
        .on('error', handleErrors)
        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specifiy the
        // desired output filename here.
        .pipe(source(bundleConfig.outputName))
        // Specify the output destination
        .pipe(gulp.dest(bundleConfig.dest))
        .on('end', reportFinished);
    };

    bundler.transform(babelify.configure());

    if (global.isWatching) {
      // Wrap with watchify and rebundle on changes
      bundler = watchify(bundler);
      // Rebundle on update
      bundler.on('update', bundle);
    }

    var reportFinished = function() {
      // Log when bundling completes
      //bundleLogger.end(bundleConfig.outputName);
      console.log("End: "+bundleConfig.outputName);

      if (bundleQueue) {
        bundleQueue--;
        if (bundleQueue === 0) {
          // If queue is empty, tell gulp the task is complete.
          // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
          callback();
        }
      }
    };

    return bundle();
  };

  // Start bundling with Browserify for each bundleConfig specified
  config.browserify.bundleConfigs.forEach(browserifyThis);
});

//build

var gulp = require('gulp');
gulp.task('build', ['browserify', 'markup']);


//default
var gulp = require('gulp');
gulp.task('default', ['watch']);


//markup
var gulp = require('gulp');
//var config = require('./gulpConfig').markup;

gulp.task('markup', function() {
  return gulp.src(config.markup.src)
    .pipe(gulp.dest(config.markup.dest));
});


//set watch
var gulp = require('gulp');
gulp.task('setWatch', function() {
  global.isWatching = true;
});

//watch
/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp   = require('gulp');
//var config = require('./gulpConfig');
gulp.task('watch', ['setWatch', 'browserSync'], function() {
  gulp.watch(config.markup.src, ['markup']);
});


