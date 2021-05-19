const pickRandom = require("../../functions/pickRandom");

module.exports = {
	name : 'sus',
	aliases: ["easter-egg"],
	description : 'sus',
	cooldown: 2,
	usage:'!sus',
	execute(message, args, server) {
		const crewMates = ["Black.png","Blue.png","Brown.png","Cyan.png","Green.png","Lime.png","Orange.png","Pink.png","Purple.png","Red.png","White.png","Yellow.png"];

		message.channel.send(`amogus`, {files :[`./sus pictures/${pickRandom(crewMates)}`]});
		return true;
        
	},

};
