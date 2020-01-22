import {
    src,
    dest,
    watch
} from 'gulp';

/********** global tools **********/
// yargs used to catch arguments from command line to build interactive command line
import yargs from 'yargs';
// gulp if is used to check conditions
import gulpif from 'gulp-if';
// changed is used to check changes in files
import changed from 'gulp-changed';
// browser sync used to sync browsers each other and auto reload after code changes
import browserSync from "browser-sync";
// source map used to create source map files to css and js
import sourcemaps from 'gulp-sourcemaps';

/********** style tools **********/
// gulp sass used to convert sass to css
import sass from 'gulp-sass';
// auto prefixer used to add css support for old browsers
import autoPrefixer from 'gulp-autoprefixer';
// clean css used to minify css
import cleanCss from 'gulp-clean-css';

/********** javascript tools **********/
// concat used to collect js files to one js file
import concat from 'gulp-concat';
// uglify used to minify js file
import uglify from 'gulp-uglify';
// remove debugger and console.log from production
import stripDebug from 'gulp-strip-debug';

/********** images tools **********/
import imagemin from 'gulp-imagemin';

let theme_name = 'mohamednajiub';

let root = `../${theme_name}`;

let php_files = `${root}/**/*.php`,
    style_files = `${scss}/**/*.scss`;

let scss = `${root}/src/sass`,
    css_dest = `${root}/css/`;

let js_src = `${root}/src/js`,
    js_dest = `${root}/dest/js`;

let images_src = `${root}/src/images`,
    images_dest = `${root}/dest/images`;

const production = yargs.argv.prod;

let browser_sync = browserSync.create(),
    reload = browser_sync.reload()

export const styles = () => {
    return src(`${scss}/main.scss`)
        .pipe(gulpif(!production, sourcemaps.init({
            loadMaps: true
        })))
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoPrefixer({
            grid: true
        }))
        .pipe(gulpif(!production, sourcemaps.write(`/`)))
        .pipe(
            gulpif(production, cleanCss({
                compatibility: 'ie8',
                debug: true,
                path: '/main.min.css'
            }, (details) => {
                console.log(`original file size ${details.name}: ${details.stats.originalSize}`);
                console.log(`minified file size ${details.name}: ${details.stats.minifiedSize}`);
            }))
        )
        .pipe(dest(css_dest))
    ;
}


export const scripts = () => {
    return src()
        .pipe(concat())
        .pipe(uglify())
        .pipe(dest(js_dest))
}

export const images = () => {
    return src(`${images_src}/**/*`)
        .pipe(changed(images_dest))
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
        ]))
        .pipe(dest(images_dest))
}

export const watchForChanges = () => {
    watch('scss/**/*.scss', styles);
}