
// require('babel-polyfill'); // es7：async-await 
// require('babel-plugin-transform-runtime');

var gulp = require("gulp");
var babel = require('gulp-babel'); // babel转换
// var eslint = require('gulp-eslint'); // eslint检测
var concat = require('gulp-concat'); // 合并文件
var uglify = require('gulp-uglify'); // 压缩js
var cleanCss = require('gulp-clean-css'); // 压缩css
var less = require('gulp-less'); // less编译
var sass = require("gulp-sass"); // sass编译
var htmlmin = require('gulp-htmlmin'); // html压缩
var imagemin = require('gulp-imagemin'); // 图片压缩
var connect = require('gulp-connect'); // 起server服务 connect.reload()
var browserSync = require("browser-sync").create("My Server"); // 得到一个 browserSync 实例
var del = require('del'); // 清空目录



// html压缩公共函数
function htmlMin () {
    return gulp.src("src/**/*.html")
            .pipe(
                htmlmin(
                    { collapseWhitespace: true }
                )
            )
            .pipe(gulp.dest("src/dist/htmlmin")); 
}

// less/sass 转译，并压缩css
function lessmin () {
    return gulp.src("src/**/*.less")
            .pipe(less())
            .pipe(cleanCss())
            .pipe(gulp.dest("src/dist/cssmin"))
            .pipe(gulp.src("src/dist/cssmin/**/*.css"))
            .pipe(concat("all.min.css")) // less 和 sass 编译后的css合并成一个 all.min.css
            .pipe(gulp.dest("src/dist/cssmin"));
}
function sassmin () {
    return gulp.src("src/**/*.scss")
            .pipe(sass())
            .pipe(cleanCss())
            .pipe(gulp.dest("src/dist/cssmin"))
            .pipe(gulp.src("src/dist/cssmin/**/*.css"))
            .pipe(concat("all.min.css")) // less 和 sass 编译后的css合并成一个 all.min.css
            .pipe(gulp.dest("src/dist/cssmin"));
}

// js 压缩、合并
function jsMin () {
    // 由于 glob 匹配时是按照每个 glob 在数组中的位置依次进行匹配操作的，所以 glob 数组中的取反（negative）glob 必须跟在一个非取反（non-negative）的 glob 后面。第一个 glob 匹配到一组匹配项，然后后面的取反 glob 删除这些匹配项中的一部分。如果取反 glob 只是由普通字符组成的字符串，则执行效率是最高的。
    return gulp.src([ "src/js/common.js", "src/js/*.js" ])  // [ "src/js/common.js", "src/js/*.js", "!src/js/common.js" ]
            .pipe(babel(
                {
                    presets: ['@babel/env']
                }
            ))
            // .pipe(concat("main.min.js"))
            .pipe(uglify())
            .pipe(gulp.dest("src/dist/jsmin"))
            .pipe(gulp.src("src/dist/jsmin/*.js"))
            .pipe(concat("main.min.js")) // 所有js目录下的js编译后的css合并成一个 main.min.js
            .pipe(gulp.dest("src/dist/jsmin"));
}

// 图片合并压缩
function imgMin () {
    return gulp.src("src/assets/*")
            .pipe(imagemin())
            .pipe(gulp.dest("src/dist/imgmin"));
}

// 新的导出写法，gulp 会自动兼容 task("", fn) 写法。
// exports.htmlMin = task(htmlMin);


/* -------------------------------------------------------- Clean -------------------------------------------------------- */
// async-await
gulp.task("clean", async function () {
    await del([ "src/dist/" ]);
});

/* -------------------------------------------------------- Html -------------------------------------------------------- */
gulp.task("html:build", async function (done) {
    await htmlMin();
});

/* -------------------------------------------------------- Less -------------------------------------------------------- */
gulp.task("less:dev", function (done) {
    // await lessmin().pipe(browserSync.reload());
    lessmin();
    browserSync.reload();
    done();
});
gulp.task("less:build", async function () {
    await lessmin();
});

/* -------------------------------------------------------- Sass -------------------------------------------------------- */
gulp.task("sass:dev", function (done) {
    sassmin();
    browserSync.reload();
    done();
});
gulp.task("sass:build", async function () {
    await sassmin();
});

/* -------------------------------------------------------- Js -------------------------------------------------------- */
gulp.task("js:dev", function (done) {
    jsMin();
    browserSync.reload();
    done();
});
gulp.task("js:build", async function () {
    await jsMin();
});

/* -------------------------------------------------------- Image -------------------------------------------------------- */
gulp.task("img:dev", function (done) {
    imgMin();
    browserSync.reload();
    done();
});
gulp.task("img:build", async function () {
    await imgMin();
});

/* -------------------------------------------------------- Server -------------------------------------------------------- */
gulp.task("server", function (done) {
    /*
    connect.server({
        root: 'src/',
        port: 3000,
        livereload: true
    });
    // */
    
    // browser-sync 2.0.0+
    browserSync.init({
        server: "src", // 静态服务器根目录
        // proxy: "192.168.0.2", // 代理
    
    });

    // 或通过执行回调，告知gulp这个异步任务已经完成
    done();
});


/* -------------------------------------------------------- Watch -------------------------------------------------------- */
gulp.task("watch", function (done) {
    gulp.watch("src/**/*.html").on('change', function (eventType, filename) {
        browserSync.reload();
    }); // html文件变化时只刷新不压缩
    gulp.watch("src/less/*.less", gulp.series("less:dev"));
    gulp.watch("src/sass/*.scss", gulp.series("sass:dev"));
    gulp.watch("src/js/*.js", gulp.series("js:dev")); // { ignoreInitial: false }，第一次文件修改之前执行，也就是调用 watch() 之后立即执行
    gulp.watch("src/assets/*", gulp.series("img:dev"));

    done();
});

/* -------------------------------------------------------- Task -------------------------------------------------------- */
gulp.task("build", gulp.series("clean", gulp.parallel("html:build", "less:build", "sass:build", "js:build", "img:build")));

// 启动时先执行一次 build 
gulp.task("dev", gulp.series("build", "server", "watch"));

/* -------------------------------------------------------- CMD -------------------------------------------------------- */
// 开发环境时 $ gulp dev 
// 生产环境时 $ gulp build 
