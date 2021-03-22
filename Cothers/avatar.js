const Discord = require('discord.js');
const client = new Discord.Client();
client.client;

module.exports = {
	name : 'avatar',
	description : 'sends the avatar of the user',
	usage:'!avatar <@user>',
	execute(message, args) {
		if(!args.length) {
			const image = message.author.displayAvatarURL();
			message.channel.send(image);
		}
		else if(args.length) {
			const guy = message.mentions.users.first();
			if(!message.mentions.users.first()) {
				return message.channel.send('This user is not on the server');
			}
			const image = guy.displayAvatarURL();
			message.channel.send(image);
		}
	},

};