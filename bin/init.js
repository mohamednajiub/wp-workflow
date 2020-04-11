#! /usr/bin/env node

const fs = require('fs');
const ora = require('ora');
const execa = require('execa');
const chalk = require('chalk');
const https = require('https');



module.exports = () => {

	// Files to download

	const package_files = [{
		file_name: '.babelrc',
		file_path: 'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/.babelrc'
	}, {
		file_name: '.browserslistrc',
		file_path: 'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/.browserslistrc'
	}, {
		file_name: '.editorconfig',
		file_path: 'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/.editorconfig'
	}, {
		file_name: '.eslintrc.json',
		file_path: 'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/.eslintrc.json'
	}, {
		file_name: '.gitignore',
		file_path: 'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/.gitignore'
	}, {
		file_name: 'gulpfile.babel.js',
		file_path: 'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/gulpfile.babel.js'
	}, {
		file_name: 'package.json',
		file_path: 'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/package.json'
	}, {
		file_name: 'config.json',
		file_path: 'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/config.json'
	}, ];

	const spinner = ora(chalk.blue('1- Loading Package Files\n')).start();

	Promise.all(package_files.map(file => {
		let created_file = fs.createWriteStream(file.file_name);
		https.get(file.file_path, function (response) {
			response.pipe(created_file);
		});
	})).then(
		async () => {
			spinner.succeed(chalk.green('package files downloaded\n'));
			spinner.start(chalk.blue('2- installing npm packages\n'));
			await execa('npm', ['install']);
			spinner.succeed(chalk.green('installing packages finished successfully'));
			console.log(chalk.blue('3- initializing project data\n'));
			const init_data = require('./edit_config');
			init_data()
		}
	)
}