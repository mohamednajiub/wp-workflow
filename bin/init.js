#! /usr/bin/env node

const fs = require('fs');
const ora = require('ora');
const execa = require('execa');
const process = require('process');
const chalk = require('chalk');
const https = require('https');

module.exports = (theme_name) => {
	// Files to download

	const package_files = [
		{
			file_name: '.babelrc',
			file_path:
				'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/.babelrc',
		},
		{
			file_name: '.browserslistrc',
			file_path:
				'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/.browserslistrc',
		},
		{
			file_name: '.editorconfig',
			file_path:
				'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/.editorconfig',
		},
		{
			file_name: '.eslintrc.json',
			file_path:
				'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/.eslintrc.json',
		},
		{
			file_name: '.gitignore',
			file_path:
				'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/.gitignore',
		},
		{
			file_name: '.prettierrc.json',
			file_path:
				'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/.prettierrc.json',
		},
		{
			file_name: 'gulpfile.babel.js',
			file_path:
				'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/gulpfile.babel.js',
		},
		{
			file_name: 'package.json',
			file_path:
				'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/package.json',
		},
		{
			file_name: 'config.json',
			file_path:
				'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/config.json',
		},
	];

	process.chdir(`${theme_name}`);
	const spinner = ora(chalk.blue('2- Loading Package Files\n'));
	spinner.start();

	Promise.all(
		package_files.map((file) => {
			let created_file = fs.createWriteStream(file.file_name);
			https.get(file.file_path, function (response) {
				response.pipe(created_file);
			});
		})
	)
		.then(async () => {
			spinner.succeed(chalk.green('2- Package files downloaded\n'));
			spinner.start(chalk.blue('3- installing npm packages\n'));
			await execa('npm', ['install']);
			spinner.succeed(chalk.green('3- Installing packages finished successfully\n'));
			console.log(chalk.blue('4- Set project data\n'));
			const { edit_config } = require('./questions_handler');
			edit_config();
		})
		.catch((error) => {
			console.log(chalk.white.bgRed(error));
			console.log('please try again later');
			execa().cancel();
		});
};
