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
				const embed1 = makeEmbed('invalid username',this.usage, server);			
				sendAndDelete(message,embed1, server);
				return false;
				break;
			case "no args": 
				const image = message.author.displayAvatarURL();
				message.channel.send(image);
				return true;
				break;	
			default:
				const dude = message.guild.members.cache.get(checkUseres(message, args, 0));
			    const guy = dude.user;
				const image1 = guy.displayAvatarURL();
				message.channel.send(image1);
				return true;
				break;
		}
		
		
	},

};
