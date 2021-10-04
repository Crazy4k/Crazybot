const pickRandom = require("../../functions/pickRandom");
module.exports = {
	name : 'dice',
	description : 'Chooses randomly from 1 to 6 (If 2 or more arguments were provided, it will choose between those instead.)',
	cooldown: 2,
	worksInDMs: true,
	usage:'dice [option 1] [option 2] [option 3..4..5..]',
	category:"other",
	execute(message, args, server) {

		if(!args[0]){
			message.channel.send(`You rolled a ${pickRandom(6)}`);
			return true;
		}
		else if(args[0] && !args[1]){
			message.channel.send(`A minimum of 2 arguments are required.`);
			return false;
		}
		else if(args[1]){
			message.channel.send(`You rolled "${pickRandom(args)}"`);
			return true;
		}
		
	},

};
