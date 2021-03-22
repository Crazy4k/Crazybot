const Discord = require('discord.js');
const client = new Discord.Client();
client.client;

module.exports = {
	name : 'role-remove',
	description : ' removes a role to a user',
	usage:'!role-remove <@user> <role name>',
	whiteList:['268435456'],
	execute(message, args) {

		if (args.length === 0) {
			const embed = new Discord.MessageEmbed()
				.setTitle('Missing user')
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
				.setTitle('Missing role')
				.setColor('#f7f7f7')
				.setDescription(this.usage);
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);
			message.delete({ timeout: 4000 });
			return;
		}
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
		let Trole = message.guild.roles.cache.find(role => role.name === args.slice(1).join(' '));
		if(message.mentions.roles.first()) Trole = message.mentions.roles.first();


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
		else if(!Tmember.roles.cache.has(Trole.id)) {
			const embed = new Discord.MessageEmbed()
				.setTitle('User doesn\'t have that role')
				.setColor('#f7f7f7')
				.setDescription(this.usage);
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);
			message.delete({ timeout: 4000 });
			return;
		}
		else if (typeof Trole !== 'undefined' && !typeof Tmember !== 'undefined') {
			Tmember.roles.remove(Trole).catch(console.error);
			return message.channel.send('role has been removed:white_check_mark:');
		}
	},

};