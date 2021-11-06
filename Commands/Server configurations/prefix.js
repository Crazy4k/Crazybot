const makeEmbed = require('../../functions/embed');
const sendAndDelete = require("../../functions/sendAndDelete");
const mongo = require("../../mongo");
let {guildsCache} = require("../../caches/botCache");
const serversSchema = require("../../schemas/servers-schema");
const Command = require("../../Classes/Command");

let prefix = new Command("prefix");

prefix.set({
	aliases         : [],
	description     : "changes the prefix of the bot",
	usage           : "preifx <new prefix>",
	cooldown        : 15,
	unique          : true,
	category        : "config",
	whiteList       : "ADMINISTRATOR",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : false
});


prefix.execute = async function (message, args, server) {

let oldPrefix = server.prefix
if (args.length === 0) {
	const embed = makeEmbed('Missing argument : prefix',this.usage, server);
	sendAndDelete(message,embed, server);
	return false;
} else if (args.length > 1) {
	const embed = makeEmbed('Prefix too long',this.usage, server);
	sendAndDelete(message,embed, server);
	return false;
} else if (args[0].length > 4) {
	const embed = makeEmbed('Prefix too long',this.usage, server);
	sendAndDelete(message,embed, server);
	return false;
} else if(args[0] === server.prefix) {
	const embed = makeEmbed('Invalid prefix \nSame as before',this.usage, server);
	sendAndDelete(message,embed, server);
	return false;
}


try {
	const prefixString = args[0];

	await mongo().then(async (mongoose) =>{
		try{ 
			await serversSchema.findOneAndUpdate({_id:message.guild.id},{
				prefix:prefixString,  
			},{upsert:false});
			guildsCache[message.guild.id].prefix = prefixString;
		} finally{
			console.log("WROTE TO DATABASE");
			mongoose.connection.close();
		}

		const embed = makeEmbed(`Prefix changed from ${oldPrefix} to ${args[0]}`,'The prefix has been changed succesfuly :white_check_mark:.',"2EFF00");
		embed.setThumbnail('https://www.iconsdb.com/icons/preview/green/ok-xxl.png');
				
			message.channel.send({embeds: [embed]});
			return true;
	});
		
	
} catch (err) {console.log(err);return false;}
}

module.exports = prefix; 