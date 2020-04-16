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

const config = require('./config.json');

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

/********** Theme initialization **********/
let project_name = config.project_name;

let theme_name = config.theme_name;

let root = `../${theme_name}`;

let php_files = `${root}/**/*.php`;

let styles_src = `${root}/src/sass`,
	style_files = `${styles_src}/**/*.scss`,
	css_dest = `${root}/dest/css`;

let js_src = `${root}/src/scripts`,
	js_files = `${js_src}/**/*.js`,
	js_dest = `${root}/dest/js`;

let images_src = `${root}/src/images`,
	image_files = `${images_src}/**/*.{jpg,jpeg,png,svg,gif}`,
	images_dest = `${root}/dest/images`;

/********** styles function **********/
export const styles = () => {
	return src(`${styles_src}/main.scss`, {
			allowEmpty: true
		})
		.pipe(gulpif(!production, sourcemaps.init({
			loadMaps: true
		})))
		.pipe(sass({
			outputStyle: 'expanded',
			errLogToConsole: true
		}).on('error', sass.logError))
		.pipe(autoPrefixer({
			grid: true,
			browsers: [
				'last 5 chrome version',
				'last 5 firefox version',
				'last 5 safari version',
				'last 5 ie version'
			]
		}))
		.pipe(gulpif(!production, sourcemaps.write(`/`)))
		.pipe(dest(css_dest))
		.pipe(gulpif(production, cleanCss({
			compatibility: 'ie8'
		})))
		.pipe(gulpif(production, rename('main.min.css')))
		.pipe(gulpif(production, dest(css_dest)))
		.pipe(server.stream());
}

/********** scripts function **********/
export const scripts = () => {
	return src(`${js_src}/main.js`, {
			allowEmpty: true
		})
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
		proxy: `http://localhost/${project_name}`,
		snippetOptions: {
			ignorePaths: ["wp-admin/**"]
		},
		port: config.server_port
	});
	done();
}

export const reload_fun = (done) => {
	reload;
	done();
};

/********** watch changes function **********/
export const watchForChanges = () => {
	watch(style_files, styles);
	watch(js_files, series(scripts, reload_fun));
	watch(image_files, series(images, reload_fun));
	watch(php_files, reload_fun);
}

export const dev = series(parallel(styles, images, scripts), serve, watchForChanges);
export const build = parallel(styles, scripts, images);
export default dev;
