const {
	prompt
} = require('inquirer');

const project_prompt = require('./project_prompt');
const finalization_project = require('./finalize');

module.exports = () => {
	prompt(project_prompt)
		.then(({
			project_path,
			theme_name,
			server_port
		}) => {
			const edit_config = require('./utils');
			edit_config({
				project_path,
				theme_name,
				server_port
			});
			finalization_project()
		})
};
