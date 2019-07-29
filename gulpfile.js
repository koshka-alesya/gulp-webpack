const gulp= require("gulp");
const plumber = require("gulp-plumber");/*для ошибок */
const gulpIf = require("gulp-if");


//clear
const del = require("del");

//templates 
const pug = require("gulp-pug");

//styles 
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const minifyCss = require("gulp-clean-css");

//scripts 
const webpack = require("webpack");
const gulpWebpack = require("webpack-stream");
const webpackConfig = require("./webpack.config.js");


//image 
const imagemin = require("gulp-imagemin");

//server 
const browserSync = require("browser-sync").create();



const isProduction = process.env.NODE_ENV === "production";



const PATHS={
    app:"./app",
    dist:"./dist"
}

gulp.task(`clear`, ()=>{
    return del(PATHS.dist);
});

gulp.task(`templates`, ()=>{
    return gulp
    .src(`${PATHS.app}/pages/**/*.pug`, { since: gulp.lastRun("templates") }) /*чтобы не повтарялись файлы в сборке, имя таска*/
    .pipe(plumber())
    .pipe(pug({ pretty: true }))/*компилируем в html - в нормальном виде с отступами*/
    .pipe(gulp.dest(PATHS.dist))/*собранный файл кладем в дист, метод дест размещает файлы на диске*/
    /*.pipe(browserSync.stream());*/

});





gulp.task(`scripts`, ()=>{
    return gulp
    .src(`${PATHS.app}/common/scripts/*.js`, { since: gulp.lastRun("scripts") })
    .pipe(plumber())
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(`${PATHS.dist}/assets/scripts`));
});

gulp.task("styles", () => {
    return gulp
        .src(`${PATHS.app}/common/styles/**/*.scss`, {
            since: gulp.lastRun("styles")
        })
        .pipe(plumber())
        .pipe(gulpIf(!isProduction, sourcemaps.init()))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulpIf(isProduction, minifyCss()))
        .pipe(gulpIf(!isProduction, sourcemaps.write()))
        .pipe(gulp.dest(`${PATHS.dist}/assets/styles`));
});

gulp.task("images", () => {
    return gulp
        .src(`${PATHS.app}/common/images/**/*.+(png|jpg|jpeg|gif|svg|ico)`, {
            since: gulp.lastRun("images")
        })
        .pipe(plumber())
        .pipe(gulpIf(isProduction, imagemin()))
        .pipe(gulp.dest(`${PATHS.dist}/assets/images`));
});

gulp.task("server", () => {
    browserSync.init({
        server: PATHS.dist
    });
    browserSync.watch(PATHS.dist + "/**/*.*", browserSync.reload);
});

gulp.task("watch", () => {
    gulp.watch(`${PATHS.app}/**/*.pug`, gulp.series("templates"));
    gulp.watch(`${PATHS.app}/**/*.scss`, gulp.series("styles"));
    gulp.watch(`${PATHS.app}/**/*.js`, gulp.series("scripts"));
    gulp.watch(
        `${PATHS.app}/common/images/**/*.+(png|jpg|jpeg|gif|svg|ico)`,
        gulp.series("images")
    );
});

gulp.task(
    "default",
    gulp.series(
        gulp.parallel("templates", "styles", "scripts", "images"),
        gulp.parallel("watch", "server")
    )
);

gulp.task(
    "production",
    gulp.series(
        "clear",
        gulp.parallel("templates", "styles", "scripts", "images")
    )
);

gulp.task(
    "copy", () =>{
        return gulp
        .src(`${PATHS.app}/common/fonts/**/*.+(otf|ttf)`, {
            since: gulp.lastRun("copy")
        })
        .pipe(plumber())
        .pipe(gulp.dest(`${PATHS.dist}/assets/fonts`));
    }
);

/*



gulp.task(`images`, ()=>{console.log("images")});
gulp.task(`copy`, ()=>{console.log("copy")});
gulp.task(`server`, ()=>{console.log("server")});
gulp.task(`watch`, ()=>{console.log("watch")});
*/
