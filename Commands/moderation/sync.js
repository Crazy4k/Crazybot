const makeEmbed = require("../../functions/embed");
const sync = require("../../functions/sync");


module.exports = {
	name : 'sync',
	description : "syncs all data between the bot's cache and the data base, removes left members from the server's data base and creates some files for the server if missing.",
    cooldown: 5 * 60,
    whiteList:'ADMINISTRATOR',
	usage:'sync',
	category:"Moderation",
	async execute(message, args, server) { 
				
		let embed = makeEmbed("Syncing...","",server);
		message.channel.send(embed).then(async msg =>{
			
			let whatToSay = await sync(message);

			if(!whatToSay.length) whatToSay = "No changes applied."
			else whatToSay = whatToSay.join(" ");
			embed.setColor("29C200");
			embed.setTitle("synchronization complete ✅");
			embed.setDescription(`Summary of changes: ${whatToSay}`);
			msg.edit(embed);
			
		});

	},	

};
