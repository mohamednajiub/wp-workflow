const path = require('path');
const fs = require('fs');


// console.log(config_path);

module.exports = (project_data) => {
	// console.log(project_data)
	// fs.writeFileSync(config, JSON.stringify(project_data))
	const config_path = path.resolve(process.cwd(), './config.json');
	const config = require(config_path);
	config.project_name = project_data.project_name;
	config.theme_name = project_data.theme_name;
	config.server_port = parseInt(project_data.server_port);

	fs.writeFile(config_path, JSON.stringify(config, null, 2), function writeJSON(err) {
		if (err) return console.log(err);
	});
}
