const makeEmbed = require("../../functions/embed");
const timerArray = require("../../caches/botCache").timerCache
let {fetchesCache} = require("../../caches/botCache");
const mongo = require("../../mongo");
const serverSchema = require("../../schemas/servers-schema");
const moment = require("moment");
const client = require("../../index");
const Command = require("../../Classes/Command");

let status = new Command("status");

status.set({
	aliases         : ["stats","lag","latency"],
	description     : "Shows basic status info related to the bot's connection and run time.",
	usage           : "status",
	cooldown        : 10,
	unique          : false,
	category        : "other",
	whiteList       : null,
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true
});


status.execute = async function(message, args, server) {

	const totalTimerCache = timerArray[1];
	
	message.reply({embeds: [makeEmbed("Calculating....","","",false,"")]}).then(async (newMsg) =>{

		let one = moment();
		await mongo().then(async (mongoose) =>{
			try{ 
				await serverSchema.findOne({_id:message.guild.id});
			} finally{

				console.log("FETCHED FROM DATABASE");
				mongoose.connection.close();
			}
		});
		let two = moment();
		let dataBasePing = two - one;

		let minute = totalTimerCache.hours
		if(minute === 0)minute = 1;


		const embed = makeEmbed("Bot's status report!", "", server, true);
		embed.addFields(
			{name:"Online since", value:`<t:${parseInt(client.readyTimestamp / 1000)  }:R> | <t:${parseInt(client.readyTimestamp / 1000)}:F>`, inline: true},
			{name:"Data base Ping ", value:`${dataBasePing} ms`, inline: true},
			{name:"Discord API Ping ", value:`${client.ws.ping} ms`, inline: true},
			{name:"Fetches per hour rate", value:`${fetchesCache.totalFetches / minute} Fetch per hour`, inline: true},
			
		);
		if(message.type === "APPLICATION_COMMAND")message.editReply({embeds:[embed]});
		else newMsg.edit({embeds: [embed]})
		return true;

	});

}

module.exports = status;
