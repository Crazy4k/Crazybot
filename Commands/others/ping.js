module.exports = {
	name : 'ping',
	aliases: ["test","pang"],
	description : 'the basic ping command. Mainly used to test if the bot was on or not',
	usage:'!ping',
	execute(message, args, server) {
		message.channel.send('pong!');
		return true;
	},

};
