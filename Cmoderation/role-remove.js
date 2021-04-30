
const makeEmbed = require('../functions/embed');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../config.json");
const checkUseres = require("../functions/checkUser");

module.exports = {
	name : 'role-remove',
	description : ' removes a role to a user',
	usage:'!role-remove <@user> <role name>',
	whiteList:['268435456'],
	execute(message, args) {

		let Trole = message.guild.roles.cache.find(role => role.name === args.slice(1).join(' '));
		if(message.mentions.roles.first()) Trole = message.mentions.roles.first();


		switch (checkUseres(message, args, 0)) {
			case "not valid":
			case "everyone":	
			case "not useable":
				try {
		
					const embed = makeEmbed('invalid username',this.usage);
			
					message.channel.send(embed)
						.then(msg => msg.delete({ timeout : failedEmbedTO }))
						.catch(console.error);
					return message.delete({ timeout: faliedCommandTO });
			
				} catch (error) {
					console.error(error);
				}
				break;
			case "no args": 
				const embed = makeEmbed('Missing arguments',this.usage);
		
					message.channel.send(embed)
						.then(msg => msg.delete({ timeout : failedEmbedTO }))
						.catch(console.error);
					return message.delete({ timeout: faliedCommandTO });
						break;
				
			default:
				if (args.length === 1) {

					const embed = makeEmbed('Missing role',this.usage);
		
					message.channel.send(embed)
						.then(msg => msg.delete({ timeout : 15000 }))
						.catch(console.error);
					return message.delete({ timeout: 4000 });
		
				}else if (typeof Trole === 'undefined') {

					const embed = makeEmbed('Invalid role',this.usage);
		
					message.channel.send(embed)
						.then(msg => msg.delete({ timeout : 15000 }))
						.catch(console.error);
					return message.delete({ timeout: 4000 });
		
				} 
		
				const Tmember = message.guild.members.cache.get(checkUseres(message, args, 0));
		
				 if(!Tmember.roles.cache.has(Trole.id)) {
		
					const embed = makeEmbed('User doesn\'t have that role\n Use`!role-add` instead',this.usage);
		
					message.channel.send(embed)
						.then(msg => msg.delete({ timeout : 15000 }))
						.catch(console.error);
					return message.delete({ timeout: 4000 });
		
				} else if (typeof Trole !== 'undefined' && !typeof Tmember !== 'undefined') {
		
					Tmember.roles.remove(Trole).catch(console.error);
					return message.channel.send('role has been removed:white_check_mark:');
				}
				break;
		}


	},

};