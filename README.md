***可下载扩展程序如 Markdown Preview Enhanced 可视化看该md文件***

# Gulp 4

~可参考文章：https://juejin.im/post/5ce92417f265da1ba328a0e0#heading-0~ 
~中文文档：https://www.gulpjs.com.cn/~ 

### Init project
cmd: `npm init -y` or `yarn init -y`

### Install
cmd：如果已经有package.json文件，`npm install` or `yarn add` 即可安装配置表里所需所有模块。添加模块基本命令：`npm install xxx` or `yarn add xxx`
>全局：
`npm install gulp -g` or `yarn add gulp -g`；

>项目下：
开发依赖：`npm install gulp --dev` or `yarn add gulp --dev`
项目依赖：`npm install gulp` or `yarn add gulp`

### Create gulpfile.js
项目根目录下创建 gulpfile.js
```js
    var gulp = require("gulp"),
        less = require("gulp-less"),
        connect = require("gulp-connect"); // 服务插件可选，如 var browserSync  = requir("browser-sync").create();调用 browserSync.reload();
        
    gulp.task("less", function (done) {
        gulp.src("src/**/*.less") // 获取 stream
        .pipe(less()) // pipe链接流，调用less转译成css
        .pipe(gulp.dest("dist")) // dest 指定目录下写入文件，可存放生成的文件
        .pipe(connect.reload()); // 自动刷新

        // 可 return stream/Promise，或将 task的function改为 async function () { await } 等方式 标识该任务完成
        done(); // 通知gulp该任务完成，否则无法再次执行任务
    });

    // events：文件增删改等事件
    gulp.watch("src", { events: all } /*可选参数*/, function () {

    });

    // 若 未指定gulp启动任务名，默认执行 default 任务
    // gulp.series 串行执行，gulp.parall 并行执行
    gulp.task("default", gulp.series("clean", gulp.parall("less", "")))
```

### Start
cmd：`gulp` or `gulp taskName`