#! /usr/bin/env node
const argv = require('yargs').argv;

let project_name = argv.project_name;
let theme_name = argv.theme_name;

module.exports = {project_name, theme_name}