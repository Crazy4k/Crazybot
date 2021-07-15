const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");

module.exports = {
	name : 'ban',
	description : 'permanently bans any one in the server. The number is to delete the last messages send by the banned user (max is 7).',
	usage:'!ban <@user> <reason> [ delete messages 0-7]',
	whiteList:'BAN_MEMBERS',
	cooldown: 3,
	category:"Moderation",
	execute(message, args, server) {

		
		const time = args[1] * 2 / 2;
		let id = checkUseres(message,args,0);

		switch (id) {
			case "not valid":
			case "everyone":	
			case "not useable":
				const embed1 = makeEmbed('invalid username',this.usage, server);
				sendAndDelete(message,embed1, server);
				return false;
				break;
			case "no args": 
				const embed = makeEmbed('Missing arguments',this.usage, server);
				sendAndDelete(message,embed, server );
				return false;
				break;
			default:
				const target = message.guild.members.cache.get(id);

		  if(args.length === 1) {
			
			const embed = makeEmbed('Missing argument : reason',this.usage, server);
			sendAndDelete(message,embed, server );
			return false;
			
		} else if(!isNaN(time)) {
			try {
				
				target.ban({ reason:args.slice(2).join(' '), days:time })
				.then(a=>{
					message.channel.send(`The user <@${target.id}> has been banned for ${args.slice(2).join(' ')}`);
					return true;
				}).catch(e => {
					
					if(!target.bannable) {
						const embed = makeEmbed('Missing Permission',"The bot can't ban that user.", server);
						sendAndDelete(message,embed, server );
						return false;
			
					}
				})
			} catch(error) {
				
				const embed = makeEmbed('Missing Permission',"The bot can't ban that user.", server);
				sendAndDelete(message,embed, server );
				return false;
			}

		} else if(typeof args[1] === 'string' && target.bannable) {
			message.channel.send(`The user <@${target.id}> has been banned for :  ${args.slice(1).join(' ')}`);

			message.delete({ timeout: server.deleteFailedMessagedAfter })
				.catch(console.error);

			target.ban({ reason:args.slice(1).join(' ') }).catch(a=>{
				console.log(a);
				const embed = makeEmbed('Missing Permission',"The bot can't ban that user.", server);
				sendAndDelete(message,embed, server );
				return false;
			})
			return true;

		}
		}
		
		
	},

};
