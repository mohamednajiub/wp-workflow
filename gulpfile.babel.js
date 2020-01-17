import { src, dest, watch } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
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

let image_src = `${root}/src/images`,
    image_dest = `${root}/dest/images`;

const production = yargs.argv.prod;





export const styles = () => {
    return src(`${scss}/main.scss`)
        .pipe(gulpif(!production, sourcemaps.init({
            loadMaps: true
        })))
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoPrefixer('last 7 versions'))
        .pipe(gulpif(!production, sourcemaps.write(`/`)))
        .pipe(gulpif(production, cleanCss({
            compatibility: 'ie8'
        })))
        .pipe(dest(css_dest));
}


export const watchForChanges = () => {
    watch('scss/**/*.scss', styles);
}