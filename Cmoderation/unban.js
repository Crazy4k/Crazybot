
const makeEmbed = require('../functions/embed');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../config.json");
const checkUseres = require("../functions/checkUser");

module.exports = {
	name : 'unban',
	description : 'unbans any one who was banned before (id is used))',
	usage:'!unban <ID> <reason>',
	whiteList:['BAN_MEMBERS'],
	execute(message, args) {

		


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
				const target = checkUseres(message, args, 0);
				if(args.length === 1) {
					try {
						const embed = makeEmbed('Missing reason',thsi.usage);
		
						message.channel.send(embed)
							.then(msg => msg.delete({ timeout : failedEmbedTO }))
							.catch(console.error);
						message.delete({ timeout: faliedCommandTO });
		
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