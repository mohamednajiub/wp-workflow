#!/usr/bin/env node

const {
	prompt
} = require('inquirer');

const project_prompt = require('./project_prompt');
// const edit_config = require('./utils');

const install = require('../lib/init');

prompt(project_prompt)
	.then(({
		project_name,
		theme_name,
		server_port
	}) => {
		install();
		console.log(project_name);
		console.log(theme_name);
		console.log(server_port);
		// edit_config({
		// 	project_name,
		// 	theme_name,
		// 	server_port
		// })
	})
