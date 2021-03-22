const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandfiles01 = fs.readdirSync('./Cothers/').filter(file =>file.endsWith('.js'));
const commandfiles02 = fs.readdirSync('./Cfun/').filter(file =>file.endsWith('.js'));


module.exports = {
	name : 'info',
	description : 'Sends the information about any command in the bot',
	usage:'!info <command>',
	execute(message, args) {
		if(args.length === 0) {
			try {
				const embed = new Discord.MessageEmbed()
					.setColor('#f7f7f7')
					.setTitle('Missing command')
					.setDescription('!info <command>');

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
		for(const file of commandfiles01) {
			const command = require(`../Cothers/${file}`);
			if(command.name === args[0]) {
				try {
					const embed = new Discord.MessageEmbed()
						.setColor('#f7f7f7')
						.setTitle('Info !')
						.setFooter('Developed by Crazy4k')
						.setTimestamp()
						.addFields(
							{ name:'usage', value:command.usage, inline: false },
							{ name:'description', value:command.description, inline:false },
						);
					message.channel.send(embed);
					return;
				}
				catch (error) {
					console.error(error);
				}
				return;
			}
		}
		for(const file of commandfiles02) {
			const command = require(`../Cfun/${file}`);
			if(command.name === args[0]) {
				try {
					const embed = new Discord.MessageEmbed()
						.setColor('#f7f7f7')
						.setTitle('Info !')
						.setFooter('Developed by Crazy4k')
						.setTimestamp()
						.addFields(
							{ name:'usage', value:command.usage, inline: false },
							{ name:'description', value:command.description, inline:false },
						);
					message.channel.send(embed);
					return;
				}
				catch (error) {
					console.error(error);
				}
				return;
			}
		}
		message.channel.send('Couldn\'t find any command with that name')
			.then(msg => msg.delete({ timeout: 10000 }))
			.catch(console.error);
		message.delete({ timeout : 4000 });
		return;

	},

};
