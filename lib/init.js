#! /usr/bin/env node

// const argv = require('yargs').argv;

// let project_name = argv.project_name;
// let theme_name = argv.theme_name;


// const fs = require('fs');
// module.exports = {
// 	project_name,
// 	theme_name
// }
const fs = require('fs');
const download = require('download');
const theCWD = process.cwd();
const ora = require('ora');
const execa = require('execa');

module.exports = () => {
	// Init.
	// clearConsole();

	// Files.
	const filesToDownload = [
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/.babelrc',
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/.browserslistrc',
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/.editorconfig',
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/..eslintrc',
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/.gitignore',
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/gulpfile.babel.js',
		'https://raw.githubusercontent.com/mohamednajiub/wp-workflow/master/package.json',
	];

	const spinner = ora({
		text: ''
	});
	// Dotfiles (if any).
	const dotFiles = ['.editorconfig', '.eslintignore', '.eslintrc.js', '.gitignore'];
	// Download.
	Promise.all(filesToDownload.map(x => download(x, `${theCWD}`))).then(async () => {
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
