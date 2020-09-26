const { prompt } = require('inquirer');

const { basic_init, theme_name, project_prompt } = require('./prompt_questions');

const finalization_project = require('./finalize');

const basic_prompt = () => {
	prompt(basic_init).then((answers) => {
		// eslint-disable-next-line quotes
		if (answers.project_type == "I'm creating a new theme from scratch") {
			prompt(theme_name).then(({ theme_name }) => {
				const { creating_theme_folders } = require('./utils');
				creating_theme_folders(theme_name);
				const installer = require('./init');
				installer(theme_name);
			});
		} else {
			prompt(theme_name).then(({ theme_name }) => {
				const installer = require('./init');
				installer(theme_name);
			});
		}
	});
};

const edit_config = () => {
	prompt(project_prompt).then(({ project_path, server_port }) => {
		const { edit_config } = require('./utils');
		edit_config({
			project_path,
			server_port,
		});
		finalization_project();
	});
};

module.exports = {
	basic_prompt,
	edit_config,
};
