const makeEmbed = require("../../functions/embed");
const sync = require("../../functions/sync");
const Command = require("../../Classes/Command");

let syncCommand = new Command("sync");

syncCommand.set({
    
	aliases         : null,
	description     : "Syncs data between the bot's cache and the data base and removes any outdated data.",
	usage           : "sync",
	cooldown        : 3 * 60,
	unique          : true,
	category        : "Moderation",
	whiteList       : "ADMINISTRATOR",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true
});


syncCommand.execute = async function(message, args, server, isSlash) { 
			
	let embed = makeEmbed("Syncing...","",server);
	message.reply({embeds:[embed]}).then(async msg =>{
		
		let whatToSay = await sync(message);

		if(!whatToSay.length) whatToSay = "No changes applied."
		else whatToSay = whatToSay.join(" ");
		embed.setColor("29C200");
		embed.setTitle("synchronization complete ✅");
		embed.setDescription(`Summary of changes: ${whatToSay}`);
		if(isSlash) message.editReply({embeds:[embed]});
		else msg.edit({embeds:[embed]});
		return true;
		
	});

}

module.exports = syncCommand;
