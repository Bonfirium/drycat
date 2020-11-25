function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArrayElement<T>(array: Array<T>): T {
	return array[randomInt(0, array.length)];
}
