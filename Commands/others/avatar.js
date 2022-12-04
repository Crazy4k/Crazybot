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
	isSlashCommand  : true,
	options			: [{
		name : "user",
		description : "The user to get the avatar of",
		required : false,
		autocomplete: false,
		type: 6,
		}

	],
});

avatar.execute =  async function(message, args, server) {
	//if there was no arguments, send the avatar of the sender
let authorID;
let person
if(message.type === "APPLICATION_COMMAND"){
	if(args[0])person = args[0].value;
	else person = undefined;
	authorID = message.user.id; 
} else person = checkUseres(message, args, 0);

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
			if(!person)person = authorID
			let dude = message.guild.members.cache.get(person);
			if(!dude) {
				dude = await message.guild.members.fetch(person);
			}
			const image1 = dude.user.displayAvatarURL();
			message.reply(image1);
			return true;
	}
}

module.exports = avatar;