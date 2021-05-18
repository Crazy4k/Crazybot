
const makeEmbed = require('../../functions/embed');

const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const checkRoles = require("../../functions/checkRoles");



module.exports = {
	name : 'role-remove',
	description : ' removes a role to a user',
	usage:'!role-remove <@user> <role name>',
	whiteList:'MANAGE_ROLES',
	execute(message, args, server) {

		let Trole = message.guild.roles.cache.find(role => role.name === args.slice(1).join(' '));
		if(message.mentions.roles.first()) Trole = message.mentions.roles.first();


		switch (checkUseres(message, args, 0)) {
			case "not valid":
			case "everyone":	
			case "not useable":
				const embed1 = makeEmbed('invalid username',this.usage, server);
				sendAndDelete(message,embed1, server);
				return false;	
				break;
			case "no args": 
				const embed2 = makeEmbed('Missing arguments',this.usage, server);
				sendAndDelete(message,embed2, server);
				return false;
				break;
			default:

				switch (checkRoles(message, args, 1)) {
					case "not valid":
					case "everyone":	
					case "not useable":
						const embed3 = makeEmbed('Invalid role',this.usage, server);
						sendAndDelete(message,embed3, server);
						return false;
						break;
					case "no args": 			
						const embed4 = makeEmbed('Missing argument',this.usage, server);
						sendAndDelete(message,embed4, server);
						return false;
						break;
					default:
						const Tmember = message.guild.members.cache.get(checkUseres(message, args, 0));
						const Trole = message.guild.roles.cache.get(checkRoles(message, args, 1));
				
						if(!Tmember.roles.cache.has(Trole.id)) {
				
							const embed = makeEmbed('User doesn\'t have that role\n Use`!role-add` instead',this.usage, server);
							sendAndDelete(message,embed, server);
							return false;
				
						} else if(!Tmember.manageable){
							const embed = makeEmbed('Missing Permissions',"Try making the bot's rank above the rank you are trying to manage.", server);
							sendAndDelete(message,embed, server);
							return false;
						}else if (typeof Trole !== 'undefined' && !typeof Tmember !== 'undefined') {
				
							Tmember.roles.remove(Trole)
							.then(m => message.channel.send('role has been removed :white_check_mark:'))
							.catch( e => console.log(e));
							return true;
						};
						break;
					}
				
				break;
		}


	},

};