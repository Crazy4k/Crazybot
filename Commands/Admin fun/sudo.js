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
	isSlashCommand	: true,
	options			: [
		{
			name : "message",
			description : "What you want the bot to send",
			required : true,
			autocomplete: false,
			type: 3,
		},
		{
			name : "channel",
			description : "Where to send the message in",
			required : false,
			autocomplete: false,
			type: 7,
		},

	],
})

sudo.execute = function execute(message, args, server) {


	let sudoStuff 
	let channel 
	let isSlash = false;
	if(message.type === "APPLICATION_COMMAND"){
		isSlash = true;
		sudoStuff = args[0].value;
		if(args[1])channel = args[1].value;
		else channel = message.channel.id
	} else{
		sudoStuff =args.slice(1).join(' ');
		channel = checkChannels(message,args,0);
	}
	
	
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
			 
			if(isSlash){
				message.reply({content : "done", ephemeral : true});
				location.send(sudoStuff);
				return true;
			} else {
				message.delete();
				location.send(sudoStuff);
				return true;
			}
				
	}
	

}

module.exports = sudo;