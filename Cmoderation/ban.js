const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = require('../config.json');
client.client;

module.exports = {
	name : 'ban',
	description : 'permanently bans any one in the server. The number is for deleting messages from the banned user (0-7 days)',
	usage:'!ban <@user> <reason> [ delete messages 0-7]',
	whiteList:['BAN_MEMBERS'],
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
		const time = args[1] * 2 / 2;
		if(!target.bannable) {
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
		else if(!isNaN(time)) {
			try {
				message.channel.send(`The user <@${target.id}> has been banned for ${args.slice(2).join(' ')}`)
					.then(msg => msg.delete({ timeout: 5000 }))
					.catch(console.error);
				message.delete({ timeout: 5000 });
				target.ban({ reason:args.slice(2).join(' '), days:time });
			}
			catch(error) {
				console.error(error);
				const embed = new Discord.MessageEmbed()
					.setTitle('ERROR 103')
					.setColor('FF0000')
					.setDescription('There was an issue executing the command \ncontact the developer to fix this problem.')
					.setFooter('developed by crazy4K')
					.setTimestamp();
				message.channel.send(embed);
			}
			return;
		}
		else if(typeof args[1] === 'string' && target.bannable) {
			message.channel.send(`The user <@${target.id}> has been banned for :  ${args.slice(1).join(' ')}`);

			message.delete({ timeout:3000 })
				.catch(console.error);
			target.ban({ reason:args.slice(1).join(' ') });
			return;
		} message.channel.send('i couldn\'t ban that user maybe because he had a higher rank than you')
			.then(msg => msg.delete({ timeout:10000 }))
			.catch(console.error);
	},

};
