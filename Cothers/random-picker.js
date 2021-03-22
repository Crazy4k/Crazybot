module.exports = {
	name : 'pick',
	description : 'picks a random arguement',
	usage:'!pick <option 1> <option 2> [option 3..4..5..]',
	execute(message, args) {
		message.channel.send(`i picked ${pickRandom(args)}`);
	},

};
function pickRandom(argument) {
	if (typeof argument === 'number') {
		return Math.floor(Math.random() * Math.floor(argument)) + 1;
	}
	if (Array.isArray(argument)) {
		return argument[Math.floor(Math.random() * argument.length)];
	}
}