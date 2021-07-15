
const makeEmbed = require('../../functions/embed');

const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
module.exports = {
	name : 'unban',
	aliases: ["remove-ban","ban-remove","ban-"],
	description : 'Unbans a user who was banned before (id is used))',
	usage:'!unban <user ID> <reason>',
	whiteList:'BAN_MEMBERS',
	cooldown: 3,
	category:"Moderation",
	execute(message, args, server) {

		


		
		const target = args[0];
		if(!target) {	
			const embed = makeEmbed('Missing member ID',this.usage, server);
			sendAndDelete(message,embed, server);
			return false;	
		}
		if(args.length === 1) {	
			const embed3 = makeEmbed('Missing reason',this.usage, server);
			sendAndDelete(message,embed3, server);
			return false;	
		}
		if(typeof args[1] === 'string') {

			try {

				message.guild.fetchBans().then( bans => message.guild.members.unban(target));

				 message.channel.send(`The user <@${target}> has been unbanned for ${args.slice(1).join(' ')}`);
				 return true;
			} catch(error) {
				const embed = makeEmbed('Unban falied',"The given ID appears to be invalid or that member wasn't banned before.", server);
				sendAndDelete(message,embed, server);
				return false;
			}
		}
		message.channel.send('i couldn\'t unban that user maybe because he had a higher rank than you');
		return false;
		
		
	},

};