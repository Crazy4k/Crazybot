const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const makeEmbed = require("../../functions/embed");

module.exports = {
	name : 'avatar',
	description : 'sends the avatar of the user',
	usage:'!avatar [@user]',
	execute(message, args, server) {
		//if there was no arguments, send the avatar of the sender

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
			try {
				const image = message.author.displayAvatarURL();
				message.channel.send(image);
				break;
			} catch (error) {
				console.log(error);
			}
				
				
			default:
				const dude = message.guild.members.cache.get(checkUseres(message, args, 0));
			    const guy = dude.user;
				const image = guy.displayAvatarURL();
				message.channel.send(image);
				break;
		}
		
		
	},

};
