var gulp = require('gulp');
require('gulp-grunt')(gulp);
var mustache = require('gulp-mustache');
var rename = require('gulp-rename');
var theme;
var settings;
var npmPackage = require('./package.json');

gulp.task('copy-static-editor-files', function () {
    return gulp.src('editor/**').pipe(gulp.dest('build/editor/'));
});

gulp.task('mustache', ['grunt-build'], function () {
    if (!theme) {
        theme = require('./red/api/theme');
        theme.init(undefined, {}, npmPackage.version);
        settings = theme.context();
        settings.page.title = 'Edyza';
        settings.header.title = 'Edyza';
        settings.asset.red = 'red/red.js';
    }

    return gulp.src('editor/templates/index.mst')
        .pipe(mustache(settings, {
            extension: '.html'
        }))
        .pipe(gulp.dest('build/public/'));
});

var server;
gulp.task('start-simple-server', function () {
    if (server) {
        server.stop();
        server = require('./simple-server');
    } else {
        server = require('./simple-server');
    }

    server.init();
    server.start();
});

gulp.task('watch', function () {
    gulp.watch(['static-api/**',
                'simple-server.js'
            ], ['start-simple-server']);
});

gulp.task('build', ['mustache']);

gulp.task('serve', ['start-simple-server', 'watch'])

gulp.task('default', ['build']);
