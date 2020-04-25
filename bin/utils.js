const path = require('path');
const fs = require('fs');

module.exports = (project_data) => {
	const config_path = path.resolve(process.cwd(), './config.json');
	const config = require(config_path);
	config.project_path = project_data.project_path;
	config.theme_name = project_data.theme_name;
	config.server_port = parseInt(project_data.server_port);

	fs.writeFile(config_path, JSON.stringify(config, null, 2), function writeJSON(err) {
		if (err) return console.log(err);
	});
}
