#! /usr/bin/env node

const chalk = require('chalk');

module.exports = () => {
	console.log(chalk.green(' All done! your project is ready now. happy coding:). \n'));
	// Instructions
	console.log(chalk.blue('Instructions:\n'));
	console.log('npm start to start development\n');
	console.log('if you want to edit project configuration at any time edit config file');
};
