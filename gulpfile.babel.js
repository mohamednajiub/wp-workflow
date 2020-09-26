import { src, dest, watch, series, parallel } from 'gulp';

/********** global tools **********/
// yargs used to catch arguments from command line to build interactive command line
import yargs from 'yargs';
// gulp if is used to check conditions
import gulpif from 'gulp-if';
// changed is used to check changes in files
import changed from 'gulp-changed';
// browser sync used to sync browsers each other and auto reload after code changes
import browserSync from 'browser-sync';
// source map used to create source map files to css and js
import sourcemaps from 'gulp-sourcemaps';

const config = require('./config.json');

const fs = require('fs');

const path = require('path');

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
// remove debugger and console.log from production
import named from 'vinyl-named';

/********** images tools **********/
import imagemin from 'gulp-imagemin';

/********** tools initialization **********/

// create production from command line
const production = yargs.argv.prod;

// create server
let server = browserSync.create();

/********** Theme initialization **********/

let theme_name = config.theme_name;

let root = `../${theme_name}`;

let php_files = `${root}/**/*.php`;

let styles_src = `${root}${config.styles.src}`,
	style_files = `${styles_src}/**/*.scss`,
	css_dest = `${root}/dest/css`;

let js_src = `${root}${config.scripts.src}`,
	js_files = `${js_src}/**/*.js`,
	js_dest = `${root}/dest/js`;

let images_src = `${root}${config.images}`,
	image_files = `${images_src}/**/*.{jpg,jpeg,png,svg,gif}`,
	images_dest = `${root}/dest/images`;

/********** styles function **********/
export const styles = () => {
	let files = [];
	config.styles.compiled_files.map((file) => {
		let file_path = path.resolve(styles_src + file);
		files.push(file_path);
	});
	return src(files, {
		allowEmpty: true,
	})
		.pipe(changed(css_dest, { extension: '.css' }))
		.pipe(
			gulpif(
				!production,
				sourcemaps.init({
					loadMaps: true,
				})
			)
		)
		.pipe(
			sass({
				outputStyle: 'expanded',
				errLogToConsole: true,
			}).on('error', sass.logError)
		)
		.pipe(
			autoPrefixer({
				grid: true,
			})
		)
		.pipe(gulpif(!production, sourcemaps.write('/')))
		.pipe(dest(css_dest))
		.pipe(
			gulpif(
				production,
				cleanCss({
					compatibility: 'ie8',
				})
			)
		)
		.pipe(gulpif(production, dest(css_dest)))
		.pipe(server.stream());
};

/********** scripts function **********/
export const scripts = () => {
	let files = [];
	config.scripts.compiled_files.map((file) => {
		let file_path = path.resolve(js_src + file);
		files.push(file_path);
	});
	return src(files, {
		allowEmpty: true,
	})
		.pipe(changed(css_dest, { extension: '.js' }))
		.pipe(named())
		.pipe(
			webpack({
				module: {
					rules: [
						{
							test: /\.js$/,
							use: {
								loader: 'babel-loader',
								options: {
									presets: ['@babel/preset-env'],
								},
							},
						},
					],
				},
				mode: production ? 'production' : 'development',
				devtool: !production ? 'source-map' : false,
				output: {
					filename: '[name].bundle.js',
				},
				externals: {
					jquery: 'jQuery',
				},
			})
		)
		.pipe(gulpif(production, stripDebug()))
		.pipe(dest(js_dest));
};

/********** images function **********/
export const images = () => {
	return src(images_src)
		.pipe(changed(images_dest))
		.pipe(
			imagemin([
				imagemin.gifsicle({
					interlaced: true,
				}),
				imagemin.mozjpeg({
					quality: 75,
					progressive: true,
				}),
				imagemin.optipng({
					optimizationLevel: 5,
				}),
				imagemin.svgo({
					plugins: [
						{
							removeViewBox: true,
						},
						{
							cleanupIDs: false,
						},
					],
				}),
			])
		)
		.pipe(dest(images_dest));
};

/********** remove dest to build function **********/

let rmDir = function (path, callback) {
	if (fs.existsSync(path)) {
		const files = fs.readdirSync(path);

		if (files.length > 0) {
			files.forEach(function (filename) {
				if (fs.statSync(path + '/' + filename).isDirectory()) {
					rmDir(path + '/' + filename);
				} else {
					fs.unlinkSync(path + '/' + filename);
				}
			});
			fs.rmdirSync(path);
		} else {
			fs.rmdirSync(path);
		}
	} else {
		console.log('Directory path not found.');
	}
	callback;
};

export const del = (done) => {
	return rmDir('dest', done());
};

/********** copy unbundeled files **********/
export const copy_css_lib = () => {
	return src([`${styles_src}${config.styles.lib}`])
		.pipe(changed(`${css_dest}/lib`, { extension: '.min.css' }))
		.pipe(dest(css_dest));
};
export const copy_js_lib = () => {
	return src([`${js_src}${config.styles.lib}`])
		.pipe(changed(`${js_dest}/lib`, { extension: '.min.js' }))
		.pipe(dest(js_dest));
};

/********** copy unbundeled files **********/

export const build_inquirer = (done) => {
	const inquirer = require('inquirer');
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'needZip',
				message: 'Do you want to create Zip file!?',
				choices: [
					{
						key: 'yes',
						value: 'Yes, please!',
					},
					{
						key: 'no',
						// eslint-disable-next-line quotes
						value: "No, thanks. I don't need that option.",
					},
				],
			},
		])
		.then((answers) => {
			if (answers.needZip == 'Yes, please!') {
				compress_project(done);
			} else {
				done();
			}
		});
};

/********** create zip file function **********/

export const compress_project = (done) => {
	// require modules
	var archiver = require('archiver');

	// create a file to stream archive data to.
	var output = fs.createWriteStream(__dirname + `/${theme_name}.zip`);
	var archive = archiver('zip', {
		zlib: {
			level: 9,
		},
	});

	// pipe archive data to the file
	archive.pipe(output);

	config.archive_folders.map((folder) => {
		archive.directory(folder.dir_path, folder.dest_path);
	});

	// append files from a glob pattern
	config.archive_files.map((file) => {
		archive.glob(file);
	});

	archive.finalize();

	done();
};

/********** browser sync function **********/
export const serve = (done) => {
	server.init({
		proxy: `${config.project_path}`,
		snippetOptions: {
			ignorePaths: ['wp-admin/**'],
		},
		port: config.server_port,
		ui: {
			port: config.server_port + 1,
		},
	});
	done();
};

export const reload_fun = (done) => {
	server.reload();
	done();
};

/********** watch changes function **********/
export const watchForChanges = () => {
	watch(style_files, styles);
	watch(`${styles_src}${config.styles.lib}`, copy_css_lib);
	watch(js_files, series(scripts, reload_fun));
	watch(`${js_src}${config.styles.lib}`, copy_js_lib);
	watch(image_files, series(images, reload_fun));
	watch(php_files, reload_fun);
};

export const dev = series(
	parallel(styles, images, scripts, copy_css_lib, copy_js_lib),
	serve,
	watchForChanges
);
export const build = series(
	del,
	parallel(styles, scripts, images, copy_css_lib, copy_js_lib),
	build_inquirer
);
export default dev;
