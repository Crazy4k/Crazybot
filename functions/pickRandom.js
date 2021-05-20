module.exports= (argument) => {
	if (typeof argument === 'number') {
		return Math.floor(Math.random() * Math.floor(argument)) + 1;
	}
	if (Array.isArray(argument)) {
		return argument[Math.floor(Math.random() * argument.length)];
	}
}