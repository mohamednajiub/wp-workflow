const path = require('path');
const fs = require('fs');
const process = require('process');
const chalk = require('chalk');
const ora = require('ora');

const edit_config = (project_data) => {
	const config_path = path.resolve(process.cwd(), './config.json');
	const config = require(config_path);

	config.project_path = project_data.project_path;
	config.theme_name = path.basename(process.cwd());
	config.server_port = parseInt(project_data.server_port);

	fs.writeFile(config_path, JSON.stringify(config, null, 2), function writeJSON(err) {
		if (err) return console.log(err);
	});
};

const creating_theme_folders = (theme_name) => {
	const spinner = ora(chalk.blue('1- Creating theme folder structure.\n'));
	spinner.start();
	fs.mkdirSync(theme_name);
	let dirs = [
		`${theme_name}/inc`,
		`${theme_name}/template-parts`,
		`${theme_name}/template-parts/footer`,
		`${theme_name}/template-parts/header`,
		`${theme_name}/template-parts/navigation`,
		`${theme_name}/template-parts/page`,
		`${theme_name}/template-parts/post`,
		`${theme_name}/src`,
		`${theme_name}/src/sass/pages`,
		`${theme_name}/src/sass/components`,
		`${theme_name}/src/sass/animations`,
		`${theme_name}/src/sass/lib`,
		`${theme_name}/src/scripts/pages`,
		`${theme_name}/src/scripts/components`,
		`${theme_name}/src/scripts/lib`,
		`${theme_name}/src/images`,
	];

	dirs.forEach((dir) => {
		fs.mkdirSync(
			dir,
			{
				recursive: true,
			},
			(err) => {
				throw err;
			}
		);
	});
	spinner.succeed(chalk.green('1- Theme folder structure created successfully.\n'));
};

module.exports = {
	creating_theme_folders,
	edit_config,
};
