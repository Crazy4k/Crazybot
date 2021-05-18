const checkUseres = require("../../functions/checkUser");
const makeEmbed = require('../../functions/embed');
const sendAndDelete = require("../../functions/sendAndDelete");
const checkRoles = require("../../functions/checkRoles");
module.exports = {
	name : 'role-add',
	description : 'gives a role to a user',
	usage:'!role-add <@user> <role name>',
	whiteList:'MANAGE_ROLES',
	execute(message, args, server) {

		switch (checkUseres(message, args, 0)) {
			case "not valid":
			case "everyone":	
			case "not useable":
				const embed1 = makeEmbed('invalid username',this.usage, server);
				sendAndDelete(message,embed1, server );
				return false;			
				break;
			case "no args": 
				const embed2 = makeEmbed('Missing arguments',this.usage, server);
				sendAndDelete(message,embed2, server);
				return false;
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
						const Trole = message.guild.roles.cache.get(checkRoles(message,args,1));

						if(Tmember.roles.cache.has(Trole.id)) {
							const embed = makeEmbed('That user already has the role', this.usage, server);
							message.channel.send(embed)
							
							return false; 
		
						} else if(!Tmember.manageable){
							const embed = makeEmbed('Missing Permissions',"Try making the bot's rank above the rank you are trying to give.", server);
							sendAndDelete(message,embed, server);
							return false;
						} else if (typeof Trole !== 'undefined' && !typeof Tmember !== 'undefined') {
							Tmember.roles.add(Trole)
							.then(m => message.channel.send('role has been given :white_check_mark:'))
							.catch( e => console.log(e));
							return true;
						}
						break;
				}
				break;
			}

	},

};