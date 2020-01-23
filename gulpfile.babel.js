import {
    src,
    dest,
    watch,
    series,
    parallel
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
// webpack stream used to make webpack works with gulp
import webpack from 'webpack-stream';
// remove debugger and console.log from production
import stripDebug from 'gulp-strip-debug';

/********** images tools **********/
import imagemin from 'gulp-imagemin';

/********** tools initialization **********/

// create production from command line
const production = yargs.argv.prod;

// create server
let server = browserSync.create(),
    // reload browsers
    reload = server.reload();

// source map initializing
let sourcemaps_init = sourcemaps.init({
    loadMaps: true
});

/********** Theme initialization **********/
let project_name = 'Xact';

let theme_name = 'mohamednajiub';

let root = `../${theme_name}`;

let php_files = `${root}/**/*.php`;

let styles_src = `${root}/src/sass`,
    style_files = `${styles_src}/**/*.scss`,
    css_dest = `${root}/css/`;

let js_src = `${root}/src/scripts`,
    js_files = `${js_src}/**/*.js`,
    js_dest = `${root}/js`;

let images_src = `${root}/src/images`,
    image_files = `${root}/src/images/**/*.{jpg,jpeg,png,svg,gif}`,
    images_dest = `${root}/images`;

/********** styles function **********/
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

/********** scripts function **********/
export const scripts = () => {
    return src(`${js_src}/main.js`)
        .pipe(webpack({
            module: {
                rules: [{
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: []
                        }
                    }
                }]
            },
            mode: production ? 'production' : 'development',
            devtool: !production ? 'source-map' : false,
            output: {
                filename: production ? 'main.bundle.min.js' : 'main.bundle.js'
            },
        }))
        .pipe(gulpif(production, stripDebug()))
        .pipe(dest(js_dest));
}

/********** images function **********/
export const images = () => {
    return src(`${images_src}/**/*`)
        .pipe(changed(images_dest))
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.mozjpeg({
                quality: 75,
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
            imagemin.svgo({
                plugins: [{
                        removeViewBox: true
                    },
                    {
                        cleanupIDs: false
                    }
                ]
            })
        ]))
        .pipe(dest(images_dest))
}

/********** browser sync function **********/
export const serve = (done) => {
    server.init({
        proxy: `http://localhost/${project_name}`
    });
    done();
}

export const reload_fun = (done) => {
    reload;
    done();
};

/********** watch changes function **********/
export const watchForChanges = () => {
    watch(style_files, series(styles, reload_fun));
    watch(js_files, series(scripts, reload_fun));
    watch(image_files, series(images, reload_fun));
    watch(php_files, reload_fun);
}

export const dev = series(parallel(styles, images, scripts), serve, watchForChanges);
export const build = parallel(styles, scripts, images);
export default dev;