module.exports = {
	name : 'ping',
	aliases: ["test","pang"],
	cooldown: 3,
	description : 'the basic ping command that responds with "pong". Mainly used to test if the bot was on or not',
	usage:'!ping',
	category:"other",
	execute(message, args, server) {
		
		message.channel.send('pong!');
		return true;
	},

};
