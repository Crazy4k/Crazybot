const Discord = require('discord.js');


module.exports = {
	name : 'avatar',
	description : 'sends the avatar of the user',
	usage:'!avatar [@user]',
	execute(message, args) {
		//if there was no arguments, send the avatar of the sender

		if(!args.length) {

			const image = message.author.displayAvatarURL();
			message.channel.send(image);

		} else if(args.length) {

			const guy = message.mentions.users.first();
	
			if(!message.mentions.users.first()) {
				return message.channel.send('This user is not on the server');
			}

			const image = guy.displayAvatarURL();
			message.channel.send(image);
		}
	},

};
