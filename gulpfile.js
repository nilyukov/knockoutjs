'use strict';

let gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    del = require('del'),
    babel = require('gulp-babel'),
    plumber = require('gulp-plumber'),
    pug = require('gulp-pug'),
    rename = require('gulp-rename'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    tinypng = require('gulp-tinypng'),
    sourcemaps = require('gulp-sourcemaps');


let paths = {
    dir: {
        app: './src',
        dist: './public'
    },
    watch: {
        html: './src/templates/**/*.pug',
        css: './src/less/**/*.less',
        js: './src/scripts/**/*.js',
        json: './src/json/**/*.json',
        img: './src/img/**/*.*'
    },
    app: {
        html: {
            src: './src/templates/pages/index.pug',
            dest: './public'
        },
        common: {
            css: {
                src: './src/less/style.less',
                dest: './public/assets/css'
            },
            js: {
                src: './src/scripts/**/*.js',
                dest: './public/assets/js'
            },
            json: {
                src: './src/json/**/*.json',
                dest: './public/assets/json'
            },
            img: {
                src: './src/img/**/*.*',
                dest: './public/assets/img'
            },
            fonts: {
                src: './src/fonts/**/*.ttf',
                dest: './public/assets/fonts'
            }
        }
    }
};


let browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

gulp.task('server', function () {
    browserSync.init({
        server: './public',
        browser: 'chrome'
    });
});

gulp.task('watch', function () {
    gulp.watch(paths.watch.html, gulp.series('html'));
    gulp.watch(paths.watch.css, gulp.series('css'));
    gulp.watch(paths.watch.js, gulp.series('js'));
    gulp.watch(paths.watch.json, gulp.series('json'));
    gulp.watch(paths.watch.img, gulp.series('img'));
    gulp.watch(paths.watch.fonts, gulp.series('fonts'));
    gulp.watch('./public/*.html').on('change', reload);
});

gulp.task('html', function () {
    return gulp.src(paths.app.html.src)
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(paths.app.html.dest))
        .pipe(browserSync.stream());
});

gulp.task('css', function () {
    return gulp.src(paths.app.common.css.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(rename({suffix: '.min'}))
        .pipe(csso())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.app.common.css.dest))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    return gulp.src(paths.app.common.js.src)
        .pipe(plumber())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.app.common.js.dest))
        .pipe(browserSync.stream());
});

gulp.task('json', function () {
    return gulp.src(paths.app.common.json.src)
        .pipe(gulp.dest(paths.app.common.json.dest));
});

gulp.task('clean', function () {
    return del(paths.dir.dist);
});

gulp.task('img', function () {
    return gulp.src(paths.app.common.img.src)
        .pipe(tinypng('ydNp0tW5a0GgyoaXOpE6WnCTFxMsoTRe'))
        .pipe(gulp.dest(paths.app.common.img.dest));
});

gulp.task('fonts', function () {
    return gulp.src(paths.app.common.fonts.src)
        .pipe(gulp.dest(paths.app.common.fonts.dest));
});

gulp.task('default', gulp.series('clean',  gulp.parallel( 'html', 'css', 'js', 'json', 'img', 'fonts'), gulp.parallel('server', 'watch')));



