import { src, dest, watch } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from "browser-sync";
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
import changed from 'gulp-changed';
import uglify from 'gulp-uglify';
import autoPrefixer from 'gulp-autoprefixer';


let theme_name = 'mohamednajiub';

let root = `../${theme_name}`;

let php_files = `${root}/**/*.php`,
    style_files = `${scss}/**/*.scss`

let scss = `${root}/src/sass`,
    css_dest = `${root}/css/`;

let js_src = `${root}/src/js`,
    js_dest = `${root}/dest/js`;

let images_src = `${root}/src/images`,
    images_dest = `${root}/dest/images`;

const production = yargs.argv.prod;

export const styles = () => {
    return src(`${scss}/main.scss`)
        .pipe(gulpif(!production, sourcemaps.init({
            loadMaps: true
        })))
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoPrefixer({grid: true}))
        .pipe(gulpif(!production, sourcemaps.write(`/`)))
        .pipe(
            gulpif( production, cleanCss({
                    compatibility: 'ie8'
                })
            )
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
    return src(images_src)
        .pipe(changed(images_dest))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
        ]))
        .pipe(dest(images_dest))
}

export const watchForChanges = () => {
    watch('scss/**/*.scss', styles);
}