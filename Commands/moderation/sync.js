const makeEmbed = require("../../functions/embed");
const sync = require("../../functions/sync");
const Command = require("../../Classes/Command");

let syncCommand = new Command("sync");

syncCommand.set({
    
	aliases         : ["sm","slowm","chatcooldow"],
	description     : "Syncs all data between the bot's cache and the data base, removes left members from the server's data base and creates some files for the server if missing.",
	usage           : "sync",
	cooldown        : 3 * 60,
	unique          : true,
	category        : "Moderation",
	whiteList       : "ADMINISTRATOR",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : false
});


syncCommand.execute = async function(message, args, server) { 
			
	let embed = makeEmbed("Syncing...","",server);
	message.channel.send({embeds:[embed]}).then(async msg =>{
		
		let whatToSay = await sync(message);

		if(!whatToSay.length) whatToSay = "No changes applied."
		else whatToSay = whatToSay.join(" ");
		embed.setColor("29C200");
		embed.setTitle("synchronization complete ✅");
		embed.setDescription(`Summary of changes: ${whatToSay}`);
		msg.edit({embeds:[embed]});
		return true;
		
	});

}

module.exports = syncCommand;
