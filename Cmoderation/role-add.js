const Discord = require('discord.js');
const client = new Discord.Client();
client.client;

module.exports = {
	name : 'role-add',
	description : 'gives a role to a user',
	usage:'!role-add <@user> <role name>',
	whiteList:['268435456'],
	execute(message, args) {

		if (args.length === 0) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Missing argument : User')
				.setColor('#f7f7f7')
				.setDescription(this.usage);
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);
			message.delete({ timeout: 4000 });
			return;
		}
		else if (args.length === 1) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Missing argument : Role')
				.setColor('#f7f7f7')
				.setDescription(this.usage);
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);
			message.delete({ timeout: 4000 });
			return;
		}

		let Trole = message.guild.roles.cache.find(role => role.name === args.slice(1).join(' '));
		if(message.mentions.roles.first()) Trole = message.mentions.roles.first();


		if (typeof message.mentions.users.first() === 'undefined') {
			const embed = new Discord.MessageEmbed()
				.setTitle('Invalid user')
				.setColor('#f7f7f7')
				.setDescription(this.usage);
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);
			message.delete({ timeout: 4000 });
			return;
		}
		const Tmember = message.guild.members.cache.get(message.mentions.users.first().id);
		if (typeof Trole === 'undefined') {
			const embed = new Discord.MessageEmbed()
				.setTitle('Invalid role')
				.setColor('#f7f7f7')
				.setDescription(this.usage);
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);
			message.delete({ timeout: 4000 });
			return;
		}
		else if(Tmember.roles.cache.has(Trole.id)) {
			const embed = new Discord.MessageEmbed()
				.setTitle('That user already has the role')
				.setColor('#f7f7f7')
				.setDescription(this.usage);
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);
			message.delete({ timeout: 4000 });
			return;
		}
		else if (typeof Trole !== 'undefined' && !typeof Tmember !== 'undefined') {
			Tmember.roles.add(Trole).catch(console.error);
			return message.channel.send('role has been given :white_check_mark:');
		}
	},

};