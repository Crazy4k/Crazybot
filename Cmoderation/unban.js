const Discord = require('discord.js');
const fs = require('fs');
const { type } = require('os');
const client = new Discord.Client();

module.exports = {
	name : 'unban',
	description : 'unbans any one who was banned before (id is used))',
	usage:'!unban <ID> <reason>',
	whiteList:['BAN_MEMBERS'],
	execute(message, args) {
		const target = args[0];
		if(isNaN(parseInt(target))) {
			try {
				const embed = new Discord.MessageEmbed()
					.setColor('#f7f7f7')
					.setTitle('invalid ID')
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
			return;
		}
		if(args.length === 1) {
			try {
				const embed = new Discord.MessageEmbed()
					.setColor('#f7f7f7')
					.setTitle('Missing reason')
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
			return;
		}
		if(typeof args[1] === 'string') {
			try{
				message.guild.fetchBans().then(bans =>
					message.guild.members.unban(target),
				);
				return message.channel.send(`The user <@${target}> has been unbanned for ${args.slice(1).join(' ')}`);
			}
			catch(error) {
				return console.error(error);
			}
		}return message.channel.send('i couldn\'t unban that user maybe because he had a higher rank than you');
	},

};