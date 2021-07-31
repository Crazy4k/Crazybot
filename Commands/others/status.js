const makeEmbed = require("../../functions/embed");
const timerArray = require("../../caches/timerCache");
const mongo = require("../../mongo");
const serverSchema = require("../../schemas/servers-schema");
const moment = require("moment");
const client = require("../../index");
let fetchesCache = require("../../caches/fetchesCache");

module.exports = {
	name : 'status',
	aliases: ["stats","lag", "ping","latency"],
	cooldown: 10,
	description : "Shows basic status info related to the bot's connection and run time.",
	usage:'status',
	category:"other",
	async execute(message, args, server) {

		const timerCache = timerArray[0];
		const totalTimerCache = timerArray[1];

		message.channel.send(makeEmbed("Calculating....","","",false,"")).then(async (newMsg) =>{
			const messagePing = newMsg.createdTimestamp- message.createdTimestamp;

			

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

			let minute = totalTimerCache.minutes
			if(minute === 0)minute = 1;

			

			const embed = makeEmbed("Bot's status report!!", "", server, true);
			embed.addFields(
				{name:"Online for", value:`${totalTimerCache.days} days ${timerCache.hours} hours ${timerCache.minutes} minutes ${timerCache.seconds} seconds`, inline: true},
				{name:"Data base Ping ", value:`${dataBasePing} ms`, inline: true},
				{name:"Bot latency ", value:`${messagePing} ms`, inline: true},
				{name:"Discord API Ping ", value:`${client.ws.ping} ms`, inline: true},
				{name:"Fetches per minute rate", value:`${fetchesCache.totalFetches / minute} Fetch per minute`, inline: true},
				
        	);
			newMsg.edit(embed);
			return true;

		});

        
	},

};
