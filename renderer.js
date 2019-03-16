// FIXME: make async
const fs = require('fs');
const path = require('path');
const { getRandomArrayElement } = require('./utils');

// FIXME: rename constants
const PATH = './renderers';
const FILE_NAME = 'index.html';

const dirents = fs.readdirSync(PATH, { withFileTypes: true });
const availableRenderers = dirents.reduce((arr, dirent) => {
	if (dirent.isDirectory()) {
		const relativePath = path.join(PATH, dirent.name, FILE_NAME);
		fs.accessSync(relativePath);
		arr.push(relativePath);
	}
	return arr;
}, [])

if (!availableRenderers) throw new Error('there are not available renderers');

module.exports = getRandomArrayElement(availableRenderers);