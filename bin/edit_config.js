const {
	prompt
} = require('inquirer');

const project_prompt = require('./project_prompt');
// const edit_config = require('./utils');

module.exports = () => {
	prompt(project_prompt)
		.then(({
			project_name,
			theme_name,
			server_port
		}) => {
			console.log(project_name);
			console.log(theme_name);
			console.log(server_port);
			const edit_config = require('./utils');
			edit_config({
				project_name,
				theme_name,
				server_port
			})
		})
};
