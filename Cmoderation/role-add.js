const Discord = require('discord.js');
const makeEmbed = require('../embed.js');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../config.json");


module.exports = {
	name : 'role-add',
	description : 'gives a role to a user',
	usage:'!role-add <@user> <role name>',
	whiteList:['268435456'],
	execute(message, args) {

		let Trole = message.guild.roles.cache.find(role => role.name === args.slice(1).join(' '));
		if(message.mentions.roles.first()) Trole = message.mentions.roles.first();
		

		if (args.length === 0) {

			const embed = makeEmbed('Missing argument : User',this.usage);

			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : failedEmbedTO }))
				.catch(console.error);

			return message.delete({ timeout: faliedCommandTO });

		} else if (args.length === 1) {
			const embed = makeEmbed('Missing argument : User',this.usage);
		
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : failedEmbedTO }))
				.catch(console.error);
			return message.delete({ timeout: faliedCommandTO });

		} else if (typeof message.mentions.users.first() === 'undefined') {

			const embed = makeEmbed('Invalid user',this.usage);

			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : failedEmbedTO }))
				.catch(console.error);

			return message.delete({ timeout: faliedCommandTO });

		} else if (typeof Trole === 'undefined') {
			const embed = makeEmbed('Invalid role',this.usage);
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : failedEmbedTO }))
				.catch(console.error);
			return message.delete({ timeout: faliedCommandTO });

		} 

		const Tmember = message.guild.members.cache.get(message.mentions.users.first().id);
		
		if(Tmember.roles.cache.has(Trole.id)) {
			const embed = makeEmbed('That user already has the role', this.usage);
			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : failedEmbedTO }))
				.catch(console.error);
			return message.delete({ timeout: faliedCommandTO });

		} else if (typeof Trole !== 'undefined' && !typeof Tmember !== 'undefined') {
			Tmember.roles.add(Trole).catch(console.error);
			return message.channel.send('role has been given :white_check_mark:');
		}
	},

};