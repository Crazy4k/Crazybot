/**
 * Picks a random argument
 * @param {*} argument Array or number to randomly pick from
 * @returns {*}  If array, returns a random item in the array. If number returns a random number under it 
 */
module.exports= (argument) => {
	if (typeof argument === 'number') {
		return Math.floor(Math.random() * Math.floor(argument)) + 1;
	}
	if (Array.isArray(argument)) {
		return argument[Math.floor(Math.random() * argument.length)];
	}
}