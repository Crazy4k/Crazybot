const pickRandom = require("../../functions/pickRandom");
module.exports = {
	name : 'pick',
	description : 'picks a random arguement',
	usage:'!pick <option 1> <option 2> [option 3..4..5..]',
	execute(message, args, server) {
		message.channel.send(`i picked ${pickRandom(args)}`);
	},

};
