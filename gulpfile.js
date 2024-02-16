const gulp = require("gulp");
const sass = require("gulp-sass")(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const cssmin = require("gulp-cssmin");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const imagemin = require('gulp-imagemin');
const fileinclude = require('gulp-file-include');
const browserSync = require("browser-sync").create();

function style() {
    return gulp
        .src("./css/style.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
}

function images() {
    return gulp
        .src('./img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));
}

function html() {
    return gulp
        .src(['./index.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist'));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("./css/**/*.scss", style).on("change", browserSync.reload);

    gulp.watch('./img/**/*', images).on("change", browserSync.reload);
    gulp.watch("./index.html", html).on("change", browserSync.reload);
}

exports.style = style;
exports.images = images;
exports.watch = watch;
exports.html = html;

const build = gulp.parallel(style, images, html);
gulp.task("build", build);
gulp.task("serve", gulp.parallel(watch, build));