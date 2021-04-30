const makeEmbed = require('../functions/embed.js');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../config.json");
const checkUseres = require("../functions/checkUser");


module.exports = {
	name : 'kick',
	description : 'kicks any user (requires a reason)',
	usage:'!kick <@user> <reason>',
	whiteList:['KICK_MEMBERS'],
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
			try {

				const embed = makeEmbed('Missing arguments',this.usage);

				message.channel.send(embed)
					.then(msg => msg.delete({ timeout : failedEmbedTO }))
					.catch(console.error);
				return message.delete({ timeout: faliedCommandTO });

			} catch (error) {
				console.error(error);
			}
			break;
				break;
			default:
				const target = checkUseres(message, args, 0);

				if(!target.kickable) {
					return message.channel.send('nope')
				} else if(args.length === 1) {
					try {

						const embed = makeEmbed('Missing argument : reason',this.usage);

						message.channel.send(embed)
							.then(msg => msg.delete({ timeout : failedEmbedTO }))
							.catch(console.error);
						return message.delete({ timeout: faliedCommandTO });
					} catch (error) {
						console.error(error);
					}
				} else if(typeof args[1] === 'string' && target.kickable) {
					message.channel.send(`The user <@${target.id}> has been kicked from the server for:  ${args.slice(1).join(' ')}`);
					target.kick({ reason:args.slice(1).join(' ') });
					message.delete({ timeout: faliedCommandTO })
						.catch(console.error);
					return;
				}return message.channel.send('i couldn\'t kick that user maybe because he had a higher rank than you')
					.then(msg => msg.delete({ timeout: failedEmbedTO }))
					.catch(console.error);
			
		}
		
	},

};