#!/usr/bin/env node

const {
	prompt
} = require('inquirer');

const project_prompt = require('./project_prompt');
const edit_config = require('./utils');

prompt(project_prompt)
	.then(({
		project_name,
		theme_name,
		server_port
	}) => {
		edit_config({
			project_name,
			theme_name,
			server_port
		})
	})
