const basic_init = [
	{
		type: 'list',
		name: 'project_type',
		message: 'Please choose your project type!',
		choices: [
			{
				key: 'new',
				// eslint-disable-next-line quotes
				value: "I'm creating a new theme from scratch",
			},
			{
				key: 'old',
				// eslint-disable-next-line quotes
				value: "I'm developing on an existing theme",
			},
		],
	},
];

const theme_name = [
	{
		name: 'theme_name',
		// eslint-disable-next-line quotes
		message: "what's your theme name?",
		default: 'awesome-theme',
	},
];

const project_prompt = [
	{
		name: 'project_path',
		message: 'Project Path',
		default: 'localhost/awesome-project',
	},
	{
		name: 'server_port',
		message: 'Server Port',
		default: 2000,
	},
];

module.exports = {
	theme_name,
	basic_init,
	project_prompt,
};
