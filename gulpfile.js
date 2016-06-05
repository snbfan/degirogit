(function (require) {
    'use strict';

    // Gulp dependencies
    var gulp = require('gulp'),
        $ = require('gulp-load-plugins')(),
        del = require('del'),

        //browserify = require('browserify'),
        //babelify = require('babelify'),
        //source = require('vinyl-source-stream'),
        //buffer = require('vinyl-buffer'),

        karmaServer = require('karma').Server,
        gulpProtractorAngular = require('gulp-angular-protractor'),
        runSequence = require('run-sequence'),

        projectName = 'degirogit',
        minifiedCssFileName = projectName + '.min.css',
        minifiedJsFileName =  projectName + '.min.js';



    // Setting up the test task
    gulp.task('test-e2e', function(callback) {
        gulp.src(['dummy_spec.js'])
            .pipe(gulpProtractorAngular({
                'configFile': 'protractor.conf.js',
                'debug': false,
                'autoStartStopServer': true
            }))
            .on('error', function(e) {
                console.log(e);
            })
            .on('end', callback);
    });


    // Unit testing
    gulp.task('test-unit', ['build-js'], function(done) {
        var server = new karmaServer({
            configFile: __dirname + '/karma.conf.js',
            singleRun: true
        }, done);

        server.start();
    });


    // Codewatcher
    gulp.task('autotest', function() {
        return gulp.watch(['src/scripts/**/*.js', 'test/unit/spec/*.js'], ['test-unit']);
    });


    // Run JSHint linter. If it fails, the build process stops.
    gulp.task('jshint', function () {
        var src = [
            'src/**/scripts/**/*.js',
            'gulpfile.js'
        ];

        return gulp.src(src)
            .pipe($.jshint({esversion: 6}))
            .pipe($.jshint.reporter('jshint-stylish'))
            .pipe($.jshint.reporter('fail'));
    });


    // Clean up build and destination folders
    gulp.task('clean', function (cb) {
        del(['dist/'], cb);
    });


    // Compile and minify less files into css file.
    gulp.task('build-css', function () {
        var src = ['src/styles/*.less'],
            dest = 'dist/styles/';

        return gulp.src(src)
            .pipe($.concat(minifiedCssFileName))
            .pipe($.less())
            .pipe($.minifyCss())
            .on('error', function (err) {
                $.util.log($.util.colors.red(err));
            })
            .pipe(gulp.dest(dest));
    });


    // Minify javascript files.
    gulp.task('build-js', function () {

        var src = ['src/scripts/app.js', 'src/scripts/**/*.js'],
            dest = 'dist/scripts';

        return gulp.src(src)
            .pipe($.babel({
                presets: ['babel-preset-es2015-script']
            }))
            .pipe($.concat(minifiedJsFileName))
            .pipe($.uglify({mangle:false}))
            .on('error', function (err) {
                $.util.log($.util.colors.red(err));
            })
            .pipe(gulp.dest(dest))
            .pipe($.size({
                title: 'javascripts'
            }));
    });


    // Minify HTML files and templates.
    gulp.task('build-html', function () {
        var dest = 'dist/';

        return gulp.src('src/index.html')
            .pipe($.htmlReplace({
                'css': 'styles/' + minifiedCssFileName,
                'js': 'scripts/' + minifiedJsFileName
            }))
            .pipe($.htmlmin({collapseWhitespace: true}))
            .pipe(gulp.dest(dest))
            .pipe($.size({
                title: 'templates'
            }));
    });


    // Doing tests
    gulp.task('test-all', function() {
        runSequence('test-unit', 'test-e2e');
    });


    // Build all
    gulp.task('build-all', function () {
        runSequence('package', 'test-all');
    });


    // Package
    gulp.task('package', function() {
        runSequence('clean', 'jshint', 'build-css', 'build-js', 'build-html');
    });


    // Default task, build all
    gulp.task('default', ['build-all']);

})(require);
