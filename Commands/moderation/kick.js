const makeEmbed = require('../../functions/embed.js');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");

module.exports = {
	name : 'kick',
	description : 'kicks any user (requires a reason)',
	usage:'kick <@user> <reason>',
	whiteList:'KICK_MEMBERS',
	cooldown: 3,
	category:"Moderation",
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
				sendAndDelete(message,embed2, server );
				return false;	
				break;
			default:
				const target = message.guild.members.cache.get(checkUseres(message, args, 0));
				if(args.length === 1) {
					const embed3 = makeEmbed('Missing argument : reason',this.usage, server);
					sendAndDelete(message,embed3, server);
					return false;			
				} else if(!target.kickable){
					const embed = makeEmbed('Missing Permissions',"Try making the bot's rank above the rank you are trying to kick.", server);
					sendAndDelete(message,embed, server);
					return false;
				}else {
					target.kick({ reason:args.slice(1).join(' ') })
						.then( e => {
							message.channel.send(`The user <@${target.id}> has been kicked from the server for "${args.slice(1).join(' ')}"`);
							return true;
						})
						.catch(e =>{ console.log(e)}); 
						return true;
					}
		}
	},

};