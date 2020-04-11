const {
	prompt
} = require('inquirer');

const project_prompt = require('./project_prompt');
const finalization_project = require('./finalize');

module.exports = () => {
	prompt(project_prompt)
		.then(({
			project_name,
			theme_name,
			server_port
		}) => {
			const edit_config = require('./utils');
			edit_config({
				project_name,
				theme_name,
				server_port
			});
			console.log(`Project Name: ${project_name}`);
			console.log(`Theme Name: ${theme_name}`);
			console.log(`Project Port: ${server_port}`);
			finalization_project()
		})
};
