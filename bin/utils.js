const path = require('path');
const fs = require('fs');

const edit_config = (project_data) => {
	const config_path = path.resolve(process.cwd(), './config.json');
	const config = require(config_path);

	config.project_path = project_data.project_path;
	config.theme_name = path.basename(path.resolve(__dirname));
	config.server_port = parseInt(project_data.server_port);

	fs.writeFile(config_path, JSON.stringify(config, null, 2), function writeJSON(err) {
		if (err) return console.log(err);
	});
}

const creating_theme_folders = (theme_name) => {
	fs.mkdirSync(theme_name);
	let dirs = [
		`${theme_name}/sass`,
		`${theme_name}/sass/pages`,
		`${theme_name}/sass/components`,
		`${theme_name}/sass/animations`,
		`${theme_name}/scripts`,
		`${theme_name}/scripts/pages`,
		`${theme_name}/scripts/components`,
		`${theme_name}/images`
	]

	dirs.forEach((dir) => {
		fs.mkdirSync(dir, {
			recursive: true
		}, (err) => {
			throw (err)
		})
	})
}

module.exports = {
	creating_theme_folders,
	edit_config
}
