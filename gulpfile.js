(function() {
    var gulp = require('gulp'),
        sass = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        jshint = require('gulp-jshint'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        plumber = require("gulp-plumber"),
        sourcemaps = require('gulp-sourcemaps'),
        reload = require('gulp-livereload'),
        sources = {
            sass: './scss/**/*.scss',
            js: './assets/js/*.js',
            jsAssets: './assets/js/vendor/**/*.js',
            fonts: './assets/fonts/**/*.*',
            images: './assets/images/**/*.*',
            cssAssets: './assets/css/**/*.css',
            bowerDir: './bower_components'
        }
        ;

    gulp.task('styles', function() {
        return gulp.src(sources.sass)
            .pipe(sourcemaps.init())
            .pipe(sass({
                errLogToConsole: true,
                outputStyle:"compressed",
                includePaths: [
                    //sources.bowerDir + '/sassy-maps/sass/',
                    //sources.bowerDir + '/breakpoint-sass/stylesheets/',
                    //sources.bowerDir + '/bootstrap-sass-official/assets/stylesheets'
                ]
            }))
            .pipe(autoprefixer())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('/assets/css'));
    });

    gulp.task('lint', function() {
        return gulp.src('./assets/js/*.js')
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'));
    });
    gulp.task('js',['lint'], function() {
        return gulp.src(sources.js)
            .pipe(plumber())
            //.pipe(sourcemaps.init())
            .pipe(concat('sgs-script.js'))
            .pipe(uglify())
            //.pipe(sourcemaps.write())
            .pipe(plumber.stop())
            .pipe(gulp.dest(destinations.js));
    });

    gulp.task('watch', ['jsAssets','fonts','images','cssAssets','html','formAssets'], function() {
        gulp.watch(sources.sass, ['styles']);
        gulp.watch(sources.js, ['js']);
        gulp.watch(sources.html, ['html']);
        gulp.watch(sources.jsAssets, ['jsAssets']);
        gulp.watch(sources.fonts, ['fonts']);
        gulp.watch(sources.images, ['images']);
        gulp.watch(sources.cssAssets, ['cssAssets']);
    });


    gulp.task('default', ['styles','js','watch']);
}).call(this);
