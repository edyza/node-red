var gulp = require('gulp');
require('gulp-grunt')(gulp);
var mustache = require('gulp-mustache');
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var bower;
var settings = {
    page: {
        title: "Node-RED",
        favicon: "favicon.ico"
    },
    header: {
        title: "Node-RED",
        image: "red/images/node-red.png"
    },
    asset: {
        red: (process.env.NODE_ENV == "development")? "red/red.js":"red/red.min.js"
    }
};
var npmPackage = require('./package.json');

gulp.task('bower-install', function () {
    if (!bower) {
        bower = require('gulp-bower');
    }
    return bower();
});

gulp.task('advanced-mustache', ['grunt-build'], function () {
    return gulp.src('editor/templates/index.mst')
        .pipe(mustache(settings, {
            extension: '.html'
        }))
        .pipe(gulp.dest('build/public/'));
});

gulp.task('simple-fill-template', function () {
    return gulp.src('simple-editor/simple-editor.ejs')
        .pipe(ejs({
            title: 'Edyza Simple Workflows',
            page: 'simple-editor'
        },{
            ext: '.html'
        }))
        .pipe(gulp.dest('build/public/'));
});

gulp.task('copy-static-files', function () {
    return gulp.src('simple-editor/resources/**').pipe(gulp.dest('build/public/resources/'));
});

gulp.task('sass', function () {
    return gulp.src('simple-editor/resources/styles/**.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/public/resources/styles'));
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
    gulp.watch([
            'editor/**'
        ], [
            'advanced-mustache',
            'serve'
        ]
    );

    gulp.watch([
            'simple-editor/**',
        ], [
            'simple-fill-template',
            'copy-static-files',
            'sass',
            'serve'
        ]
    );

    gulp.watch([
            'simple-server.js',
        ], [
            'serve'
        ]
    );

    gulp.watch([
            'bower.json'
        ], [
            'bower-install',
            'serve'
        ]
    );
});

gulp.task('build', ['advanced-mustache', 'simple-fill-template', 'copy-static-files', 'sass', 'bower-install']);

gulp.task('serve', ['start-simple-server']);

gulp.task('dev', ['build', 'serve', 'watch']);

gulp.task('default', ['build']);
