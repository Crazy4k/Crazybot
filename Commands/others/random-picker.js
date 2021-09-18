const pickRandom = require("../../functions/pickRandom");
module.exports = {
	name : 'pick',
	description : 'picks a random arguement',
	cooldown: 2,
	worksInDMs: true,
	usage:'pick <option 1> <option 2> [option 3..4..5..]',
	category:"other",
	execute(message, args, server) {
		message.channel.send(`I pick ${pickRandom(args)}`);
		return true;
	},

};
