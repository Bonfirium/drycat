function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArrayElement(array) {
	return array[randomInt(0, array.length)];
}

module.exports = {
	randomInt,
	getRandomArrayElement,
};
