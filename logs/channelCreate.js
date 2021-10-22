const moment = require('moment');
const mongo = require("../mongo");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const colors =require("../config/colors.json");
const makeEmbed = require(".././functions/embed");


module.exports = async(channel, client) => {
	if(channel.type === 'DM') return;
	if(!channel.guild) return;
	if(!channel.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR"))return;

	let i = guildsCache[channel.guild.id];
	if(!i){
		await mongo().then(async (mongoose) =>{
			try{ 
				guildsCache[channel.guild.id] =i= await serversSchema.findOne({_id:channel.guild.id});
			} finally{
				console.log("FETCHED FROM DATABASE");
				mongoose.connection.close();
			}
		});
	}
		
	try {
			
		const serverLogs = channel.guild.channels.cache.get(i.logs.serverLog);
		if (serverLogs) {
			const embed = makeEmbed('Channel created',"",colors.successGreen,true);
				embed.addFields(
					{ name:'name', value: channel.name, inline: false },
					{ name:'Category', value: `${channel.parent}`, inline: false },
					{ name:'created at', value: `<t:${parseInt(channel.createdTimestamp / 1000)}:F>\n<t:${parseInt(channel.createdTimestamp / 1000)}:R>`, inline: false },
					{ name:'ID', value: channel.id, inline: false },
				);
			serverLogs.send({embeds: [embed]}).catch(e=> console.log(e));
		}
		
			
		}catch (err) {console.log(err);}
}