
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
				try {
		
					const embed = makeEmbed('invalid username',this.usage, server);
			
					sendAndDelete(message,embed, server);
					return;
			
				} catch (error) {
					console.error(error);
				}
				break;
			case "no args": 
			const embed = makeEmbed('Missing arguments',this.usage, server);

			sendAndDelete(message,embed, server);
					return;
				break;
			default:
				const target = checkUseres(message, args, 0);
				if(args.length === 1) {
					try {
						const embed = makeEmbed('Missing reason',thsi.usage, server);
		
						sendAndDelete(message,embed, server);
					return;
					} catch (error) {
						console.error(error);
					} return;
				}
				if(typeof args[1] === 'string') {
		
					try {
		
						message.guild.fetchBans().then( bans => message.guild.members.unban(target) );
		
						return message.channel.send(`The user <@${target}> has been unbanned for ${args.slice(1).join(' ')}`);
					} catch(error) {
						return console.error(error);
					}
				} return message.channel.send('i couldn\'t unban that user maybe because he had a higher rank than you');
				break;
		}

		
		
	},

};