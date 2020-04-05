#! /usr/bin/env node

const fs = require('fs');
const download = require('download');
const theCWD = process.cwd();
const ora = require('ora');
const execa = require('execa');

module.exports = () => {

	// Files to download

	const downloadable_files = [
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/.babelrc',
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/.browserslistrc',
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/.editorconfig',
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/.eslintrc.json',
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/.gitignore',
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/gulpfile.babel.js',
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/rebuild/package.json',
	];

	const spinner = ora({
		text: ''
	});
	// Dotfiles (if any).
	const dotFiles = ['.babelrc', '.browserslistrc', '.editorconfig', '.eslintrc.json', '.gitignore'];
	// Download.
	Promise.all(downloadable_files.map(x => download(x, `${theCWD}`))).then(async () => {
		dotFiles.map(x => fs.rename(`${theCWD}/${x.slice(1)}`, `${theCWD}/${x}`, err => console.log(err)));
		spinner.succeed();

		// The npm install.
		spinner.start('2. Installing npm packages...');
		// await execa('npm', ['install', '--silent']);
		await execa('npm', ['install']);
		spinner.succeed();

		console.log('done')
	});
}
