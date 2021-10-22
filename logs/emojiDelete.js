const makeEmbed = require("../functions/embed");
const moment = require('moment');
const mongo = require("../mongo");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const colors =require("../config/colors.json");

module.exports = async (emoji, client) =>{

	try {
		if(!emoji.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR"))return;
		let i = guildsCache[emoji.guild.id];
		if(!i){
			await mongo().then(async (mongoose) =>{
				try{ 
					guildsCache[emoji.guild.id] = i = await serversSchema.findOne({_id:emoji.guild.id});
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});
		}
		const log = emoji.guild.channels.cache.get(i.logs.serverLog);
		if(log) {
			let embed = makeEmbed("Emoji deleted", "", colors.failRed, true);
			embed.addFields(
				{name:"Emoji name:", value: `${emoji.name}`, inline:true},
				{name:"Emoji ID:", value: `${emoji.id}`, inline:true},

				{name:"Created at:", value: `<t:${parseInt(emoji.createdTimestamp / 1000)}:F>\n<t:${parseInt(emoji.createdTimestamp / 1000)}:R>`, inline:true},
			);
			log.send({embeds: [embed]}).catch(e=> console.log(e));
		}
							
	}catch (err) {console.log(err)}

}