#! /usr/bin/env node

const chalk = require('chalk');

module.exports = () => {
	console.log(chalk.green('4- Project Data Initialized successfully. \n'));
	console.log(chalk.green('All done! your project is ready now. happy coding:). \n'));
	// Instructions
	console.log(chalk.blue('Instructions:\n'));
	console.log('cd theme-name\n')
	console.log('run npm start to start development\n');
	console.log('run npm build --prod to build your project.\n');
	console.log('if you want to edit project configuration at any time edit config file');
};
