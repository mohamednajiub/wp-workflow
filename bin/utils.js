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
		`${theme_name}/src`,
		`${theme_name}/src/sass/pages`,
		`${theme_name}/src/sass/components`,
		`${theme_name}/src/sass/animations`,
		`${theme_name}/src/scripts/pages`,
		`${theme_name}/src/scripts/components`,
		`${theme_name}/src/images`
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
