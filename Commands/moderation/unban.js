
const makeEmbed = require('../../functions/embed');

const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
module.exports = {
	name : 'unban',
	description : 'unbans any one who was banned before (id is used))',
	usage:'!unban <ID> <reason>',
	whiteList:'BAN_MEMBERS',
	execute(message, args, server) {

		


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
				const target = checkUseres(message, args, 0);
				if(args.length === 1) {	
					const embed3 = makeEmbed('Missing reason',thsi.usage, server);
					sendAndDelete(message,embed3, server);
					return false;	
				}
				if(typeof args[1] === 'string') {
		
					try {
		
						message.guild.fetchBans().then( bans => message.guild.members.unban(target) );
		
					 	message.channel.send(`The user <@${target}> has been unbanned for ${args.slice(1).join(' ')}`);
					 	return true;
					} catch(error) {
						console.error(error);
						return false;
					}
				}
				message.channel.send('i couldn\'t unban that user maybe because he had a higher rank than you');
				return false;
				break;
		}
	},

};