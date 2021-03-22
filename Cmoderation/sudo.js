const Discord = require('discord.js');
const client = new Discord.Client();
client.client;

module.exports = {
	name : 'sudo',
	description : 'makes the bot say whatever you want wherever you want',
	usage:'!sudo <Channel ID or name> <Message>',
	whiteList : ['ADMINISTRATOR'],
	execute(message, args) {
		if (args.length === 0) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Missing channel name')
				.setColor('#f7f7f7')
				.setDescription(this.usage);
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);
			message.delete({ timeout: 4000 });
			return;
		}
		else if(args.legth === 1) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Missing message')
				.setColor('#f7f7f7')
				.setDescription(this.usage);
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);
			message.delete({ timeout: 4000 });
			return;
		}


		const sudoStuff = args.slice(1).join(' ');
		if(!sudoStuff.length) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Can\'t send an empty message')
				.setColor('#f7f7f7')
				.setDescription(this.usage);
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);
			message.delete({ timeout: 4000 });
			return;
		}
		if(isNaN(message.guild.channels.cache.get(args[0]) * 1) && args[0] === 'here') {
			const location = message.channel;
			if (typeof location === 'undefined') {
				const embed = new Discord.MessageEmbed()
					.setTitle('Invalid channel name')
					.setColor('#f7f7f7')
					.setDescription(this.usage);
				message.channel.send(embed)
					.then(msg => msg.delete({ timeout : 15000 }))
					.catch(console.error);
				message.delete({ timeout: 4000 });
			}
			message.delete({ timeout:250 });
			location.send(sudoStuff);
			return;
		}
		if(isNaN(message.guild.channels.cache.get(args[0]) * 1)) {
			const location = message.guild.channels.cache.find(channel=>channel.name === args[0]);
			if (typeof location === 'undefined') {
				const embed = new Discord.MessageEmbed()
					.setTitle('Invalid channel name')
					.setColor('#f7f7f7')
					.setDescription(this.usage);
				message.channel.send(embed)
					.then(msg => msg.delete({ timeout : 15000 }))
					.catch(console.error);
				message.delete({ timeout: 4000 });
				return;
			}
			location.send(sudoStuff);
			message.delete({ timeout: 2000 });
		}
		if(!isNaN(message.guild.channels.cache.get(args[0]) * 1)) {
			const location = message.guild.channels.cache.get((args[0]));
			if (typeof location === 'undefined') {
				const embed = new Discord.MessageEmbed()
					.setTitle('Invalid channel id')
					.setColor('#f7f7f7')
					.setDescription(this.usage);
				message.channel.send(embed)
					.then(msg => msg.delete({ timeout : 15000 }))
					.catch(console.error);
				message.delete({ timeout: 4000 });
				return;
			}
			location.send(sudoStuff);
			message.delete({ timeout: 2000 });
		}
		return;

	},
};