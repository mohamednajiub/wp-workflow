[![GitHub](https://img.shields.io/github/issues/mohamednajiub/wp-workflow?style=flat-square)](https://github.com/mohamednajiub/wp-workflow/issues/) [![GitHub](https://img.shields.io/github/forks/mohamednajiub/wp-workflow?style=social)](https://github.com/mohamednajiub/wp-workflow/network/members) [![GitHub](https://img.shields.io/github/license/mohamednajiub/wp-workflow?style=flat-square)](https://github.com/mohamednajiub/wp-workflow/blob/master/LICENSE)

# WP-Workflow

WP Workflow is a powerful Gulp workflow for making Developing WordPress themes easier and productivity ⌛.

## How to use

install wp-workflow package globally `npm install wp-workflow -g`

- for development:

  1- Go to your WP project `wp-content/themes`\
  2- open terminal.\
  3- run `wp-workflow`\
  4- wait untill installing project and answer prompt questions\
  5- run `npm start` and then start development.

<br>

- for production\
  1- Go to your theme directory.\
  2- run `npm run build`.

```
need to work again on it! just run `npm start`
```

## WP-Workflow Capabilities

What WP-workflow can do?

### CSS Features

- convert sass to css.
- add auto prefixes to css for last 5 versions of browsers "you can edit it in `.browsersistrc` file".
- create .map file for css if you are on development mode.
- minify css files and remove .map files while building.

### JS Features

- Compile ES6 to ES5.
- create .map file for JS if you are on development mode.
- minify js files and remove .map files while building.
- remove console.log and debuggers from JS while building the project.

### Images Features

- Compress static images.
- move compressed static images from src folder to images folder in dest.

### Live Server Features

- open live server after finish all basic tasks "styles, scripts, images".
- reload server if there is changes in any files or folder.

### Create compressed file

wp-workflow can prepare your theme for publishing by compressing it in a `.zip` file if you want to create that copressed file.

- `npm run build --prod`.
- wait to finish bundling files
- you will be asked for if you want zip file or not choose yes to create copmressd file, "the compressed file will be created in project root".
- if you choose no, wp-workflow will only minify css, js, and images

### Project folder structure

```
localhost
├── wordpress project
│   └── wp-content
│       ├── themes
│       │   ├── theme name
│       │   │   ├── dest
│       │   │   │   ├── css
│       │   │   │   │   └── compiled css files
│       │   │   │   └── js
│       │   │   │   |    └── compiled js files
│       │   │   │   └── images
│       │   │   │        └── compiled images
│       │   │   ├── src
│       │   │   │   ├── sass
│       │   │   │   │   └── main.scss
│       │   │   │   └── scripts
│       │   │   │   |    └── main.js
│       │   │   │   └── images
│       │   │   │   |    └── image.png
│       │   |   |── inc
│       │   │   │   ├── php files
│       │   |   ├── templates-parts
│       │   |   │   └── php files
│       │   |   └── wp templates
│       └── index.php
```
