const Discord = require('discord.js');
const prefix = require('../config.json');
const client = new Discord.Client();
client.client;

module.exports = {
	name : 'kick',
	description : 'kicks any user (requires a reason)',
	usage:'!kick <@user> <reason>',
	whiteList:['KICK_MEMBERS'],
	execute(message, args) {
		if(!message.mentions.users.first()) {
			try {
				const embed = new Discord.MessageEmbed()
					.setColor('#f7f7f7')
					.setTitle('invalid username')
					.setDescription(this.usage);

				message.channel.send(embed)
					.then(msg => msg.delete({ timeout :10000 }))
					.catch(console.error);
				message.delete({ timeout:3000 });
				return;
			}
			catch (error) {
				console.error(error);
			}
		}
		const target = message.guild.members.cache.get(message.mentions.users.first().id);

		if(!target.kickable) {
			message.channel.send('nope')
				.then(msg=> msg.delete({ timeout : 7000 }))
				.catch(console.error);
			message.delete({ timeout: 3000 })
				.catch(console.error);
			return;
		}

		if(args.length === 1) {
			try {
				const embed = new Discord.MessageEmbed()
					.setColor('#f7f7f7')
					.setTitle('Missing argument : reason')
					.setDescription(this.usage);

				message.channel.send(embed)
					.then(msg => msg.delete({ timeout :10000 }))
					.catch(console.error);
				message.delete({ timeout:3000 });
				return;
			}
			catch (error) {
				console.error(error);
			}
		}
		else if(typeof args[1] === 'string' && target.kickable) {
			message.channel.send(`The user <@${target.id}> has been kicked from the server for:  ${args.slice(1).join(' ')}`);
			target.kick({ reason:args.slice(1).join(' ') });
			message.delete({ timeout:3000 })
				.catch(console.error);
			return;
		}return message.channel.send('i couldn\'t kick that user maybe because he had a higher rank than you')
			.then(msg => msg.delete({ timeout:10000 }))
			.catch(console.error);
	},

};