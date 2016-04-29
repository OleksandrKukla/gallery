var gulp = require('gulp'),
    rigger = require('gulp-rigger'),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync').create(),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify');

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        style: 'build/style/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        all: 'build/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/**/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/**/*.css',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*',
        all: 'src/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        all: 'src/**/*.*'
    },
    clean: './build'
};

gulp.task('build_style', function () {
    gulp.src(path.src.style) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(autoprefixer({
			browsers: ['last 50 versions'],
			cascade: false
		}))
        .pipe(csso())
        .pipe(gulp.dest(path.build.style)); //Выплюнем их в папку build
});
gulp.task('build_img', function () {
    gulp.src(path.src.img) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.img)); //Выплюнем их в папку build
});
gulp.task('build_js', function () {
    gulp.src(path.src.js) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.js)); //Выплюнем их в папку build
});
gulp.task('build_fonts', function () {
    gulp.src(path.src.fonts) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.fonts)); //Выплюнем их в папку build
});
gulp.task('build_html', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.html)); //Выплюнем их в папку build
});

gulp.task('watch', function () {
    gulp.watch(path.watch.all, function(event){
            gulp.run('build_html', 'build_style', 'build_img', 'build_js', 'build_fonts');
        });   
});

gulp.task('sync', function() {
  browserSync.init({
    server: {
      baseDir: path.build.all
    }
  }); 
  gulp.watch(path.watch.all, function(event){
        gulp.run('build_html', 'build_style', 'build_img', 'build_js', 'build_fonts');
        browserSync.reload();
    });
});