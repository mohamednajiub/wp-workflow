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
// rename used to change name of files
import rename from "gulp-rename";

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

/********** tools initialization **********/

// create production from command line
const production = yargs.argv.prod;

// create browser
let browser_sync = browserSync.create(),
    // reload browsers
    reload = browser_sync.reload();

// source map initializing
let sourcemaps_init = sourcemaps.init({
    loadMaps: true
});

/********** Theme initialization **********/
let theme_name = 'mohamednajiub';

let root = `../${theme_name}`;

let php_files = `${root}/**/*.php`;


let styles_src = `${root}/src/sass`,
    // style_files = `${styles_src}/**/*.scss`,
    css_dest = `${root}/css/`;

let js_src = `${root}/src/scripts`,
    js_dest = `${root}/js`;

let images_src = `${root}/src/images`,
    images_dest = `${root}/images`;

export const styles = () => {
    return src(`${styles_src}/main.scss`)
        .pipe(gulpif(!production, sourcemaps_init))
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoPrefixer({
            grid: true
        }))
        .pipe(gulpif(!production, sourcemaps.write(`/`)))
        .pipe(dest(css_dest))
        .pipe(
            gulpif(production, cleanCss({
                compatibility: 'ie8',
                debug: false,
            }, (details) => {
                console.log(`original file size ${details.name}: ${details.stats.originalSize}`);
                console.log(`minified file size ${details.name}: ${details.stats.minifiedSize}`);
            }))
        )
        .pipe(gulpif(production, rename('main.min.css')))
        .pipe(gulpif(production, dest(css_dest)));
}


export const scripts = () => {
    return src(`${js_src}/**/*.js`)
        .pipe(gulpif(!production, sourcemaps_init))
        .pipe(concat('/main.js'))
        .pipe(gulpif(!production, sourcemaps.write(`/`)))
        .pipe(dest(js_dest))
        .pipe(gulpif(production, uglify()))
        .pipe(gulpif(production, rename('main.min.js')))
        .pipe(gulpif(production, dest(js_dest)));
}

export const images = () => {
    return src(`${images_src}/**/*`)
        .pipe(changed(images_dest))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest(images_dest))
}

export const watchForChanges = () => {
    watch('scss/**/*.scss', styles);
}