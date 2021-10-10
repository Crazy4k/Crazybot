const makeEmbed = require('../../functions/embed');
const sendAndDelete = require("../../functions/sendAndDelete");
const checkChannels = require('../../functions/checkChannels');
const Command = require("../../Classes/Command");

let sudo = new Command("sudo");
sudo.set({
	aliases		: ["say","tell"],
	description : "makes the bot say a message in a given channel.",
	usage		: "sudo <Channel ID or #name> <Message>",
	cooldown	: 7.5,
	unique		: true,
	category	: "admin fun",
	whiteList	: "ADMINISTRATOR",
	worksInDMs	: false,
	isDevOnly	: false,
	isSlashCommand	: false
})

sudo.execute = function execute(message, args, server) {


	const sudoStuff = args.slice(1).join(' ');

	let channel = checkChannels(message,args,0);
	switch (channel) {
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
			const location = message.guild.channels.cache.get(channel);
			 
				message.delete();
	
				location.send(sudoStuff);
	
				return true;
	}
	

}

module.exports = sudo;