const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");

module.exports = {
	name : 'ban',
	description : 'permanently bans any one in the server. The number is for deleting messages from the banned user (0-7 days)',
	usage:'!ban <@user> <reason> [ delete messages 0-7]',
	whiteList:'BAN_MEMBERS',
	execute(message, args, server) {

		
		const time = args[1] * 2 / 2;

		switch (checkUseres(message, args, 0)) {
			case "not valid":
			case "everyone":	
			case "not useable":
				try {
					const embed = makeEmbed('invalid username',this.usage, server);
					sendAndDelete(message,embed, server);
					return false;
			
				} catch (error) {
					console.error(error);
				}
				break;
			case "no args": 
			try {

				const embed = makeEmbed('Missing arguments',this.usage, server);
				sendAndDelete(message,embed, server );
				return false;

			} catch (error) {
				console.error(error);
			}
				break;
			default:
				const target = checkUseres(message, args, 0);

		if(!target.bannable) {
			message.channel.send('nope');
			return false;

		} else if(args.length === 1) {
			try {
				const embed = makeEmbed('Missing argument : reason',this.usage, server);
				sendAndDelete(message,embed, server );
				return false;
			} catch (error) {
				console.error(error);
			}
		} else if(!isNaN(time)) {
			try {
				message.channel.send(`The user <@${target.id}> has been banned for ${args.slice(2).join(' ')}`);
				target.ban({ reason:args.slice(2).join(' '), days:time });
				return true;
			} catch(error) {
				console.error(error);
				const embed = makeEmbed('ERROR 103', 'There was an issue executing the command \ncontact the developer to fix this problem.', "#FF0000");
				message.channel.send(embed);
				return false;
			}

		} else if(typeof args[1] === 'string' && target.bannable) {
			message.channel.send(`The user <@${target.id}> has been banned for :  ${args.slice(1).join(' ')}`);

			message.delete({ timeout: server.deleteFailedMessagedAfter })
				.catch(console.error);
			target.ban({ reason:args.slice(1).join(' ') });
			return true;

		} message.channel.send('i couldn\'t ban that user maybe because he had a higher rank than you')
			.catch(console.error);
			return false;
		}
		
		
	},

};
