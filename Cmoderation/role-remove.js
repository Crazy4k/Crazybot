const Discord = require('discord.js');
const makeEmbed = require('../embed.js');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../config.json");


module.exports = {
	name : 'role-remove',
	description : ' removes a role to a user',
	usage:'!role-remove <@user> <role name>',
	whiteList:['268435456'],
	execute(message, args) {

		let Trole = message.guild.roles.cache.find(role => role.name === args.slice(1).join(' '));
		if(message.mentions.roles.first()) Trole = message.mentions.roles.first();

		if (args.length === 0) {

			const embed = makeEmbed('Missing user',this.usage);

			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);

			return message.delete({ timeout: 4000 });
			
		} else if (args.length === 1) {

			const embed = makeEmbed('Missing role',this.usage);

			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);
			return message.delete({ timeout: 4000 });

		} else if (typeof message.mentions.users.first() === 'undefined') {

			const embed = makeEmbed('Invalid user',this.usage);

			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);

			return message.delete({ timeout: 4000 });

		} else if (typeof Trole === 'undefined') {

			const embed = makeEmbed('Invalid role',this.usage);

			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);
			return message.delete({ timeout: 4000 });

		} 

		const Tmember = message.guild.members.cache.get(message.mentions.users.first().id);

		 if(!Tmember.roles.cache.has(Trole.id)) {

			const embed = makeEmbed('User doesn\'t have that role',this.usage);

			message.channel.send(embed)
				.then(msg => msg.delete({ timeout : 15000 }))
				.catch(console.error);
			return message.delete({ timeout: 4000 });

		} else if (typeof Trole !== 'undefined' && !typeof Tmember !== 'undefined') {

			Tmember.roles.remove(Trole).catch(console.error);
			return message.channel.send('role has been removed:white_check_mark:');
		}
	},

};