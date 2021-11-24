const makeEmbed = require("../functions/embed");
const mongo = require("../mongo");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const colors =require("../config/colors.json");
const moment = require('moment');

module.exports = async (emoji, client) =>{
	if(!emoji.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR"))return;
	const maker = await emoji.fetchAuthor();
	
	try {
		let i = guildsCache[emoji.guild.id];
		if(!i){
			await mongo().then(async (mongoose) =>{
				try{ 
					guildsCache[emoji.guild.id] =i= await serversSchema.findOne({_id:emoji.guild.id});
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});
		}
		const log = emoji.guild.channels.cache.get(i.logs.serverLog);
		if(log) {
			let embed = makeEmbed("Emoji created", "", colors.successGreen, true);
			embed.addFields(
				{name:"Emoji name:", value: `${emoji.name}`, inline:true},
				{name:"Emoji ID:", value: `${emoji.id}`, inline:true},
				{name:"Created by:", value: `<@${maker.id}>`, inline:true},
				{name:"Created at:", value: `<t:${parseInt(emoji.createdTimestamp / 1000)}:F>\n<t:${parseInt(emoji.createdTimestamp / 1000)}:R>`, inline:true},
			);
			log.send({embeds: [embed]}).then(m=>m.react(emoji.id)).catch(e=> console.log(e));
		}
						
	}catch (err) {console.log(err)}
}