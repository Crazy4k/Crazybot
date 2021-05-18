const makeEmbed = require('../../functions/embed');

const sendAndDelete = require("../../functions/sendAndDelete");
const checkChannels = require('../../functions/checkChannels');

module.exports = {
	name : 'sudo',
	description : 'makes the bot say whatever you want wherever you want',
	usage:'!sudo <Channel ID or name> <Message>',
	cooldown: 5,
	whiteList :'ADMINISTRATOR',

	execute(message, args, server) {


		const sudoStuff = args.slice(1).join(' ');

		switch (checkChannels(message, args, 0)) {
			case "not valid":
			case "not useable":
				try {
					const embed = makeEmbed('invalid Channel',this.usage, server);
					sendAndDelete(message,embed, server);
					return false;
			
				} catch (error) {
					console.error(error);
					return false;
				}
				break;
			case "no args": 
			try {

				const embed = makeEmbed("Missing channel name", this.usage, server);
				sendAndDelete(message,embed, server );
				return false;

			} catch (error) {
				console.error(error);
				return false;
			}
				break;
			default:
				if(args.legth === 1) {
		
					const embed = makeEmbed("Missing message", this.usage, server);
					sendAndDelete(message,embed, server);
					return false;
				} else if(!sudoStuff.length) {
		
					const embed = makeEmbed('Can\'t send an empty message', this.usage, server);
					sendAndDelete(message,embed, server);
					return false;
				}
				const location = message.guild.channels.cache.get(checkChannels(message,args, 0));
				 
					message.delete();
		
					location.send(sudoStuff);
		
					return true;
		}
		

	},
};