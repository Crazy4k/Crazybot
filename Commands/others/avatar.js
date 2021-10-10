const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const makeEmbed = require("../../functions/embed");
const Command = require("../../Classes/Command");

let avatar = new Command("avatar");

avatar.set({
	aliases         : [],
	description     : "Sends the avatar of the user",
	usage           : "avatar [@user]",
	cooldown        : 3,
	unique          : false,
	category        : "other",
	whiteList       : null,
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : false
});

avatar.execute =  function(message, args, server) {
	//if there was no arguments, send the avatar of the sender


	let person =checkUseres(message, args, 0);
	switch (person) {
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
			const dude = message.guild.members.cache.get(person);
			const image1 = dude.user.displayAvatarURL();
			message.channel.send(image1);
			return true;
			break;
	}
	
	
}

module.exports = avatar;