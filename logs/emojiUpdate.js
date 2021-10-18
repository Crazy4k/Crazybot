
const makeEmbed = require("../functions/embed");
const moment = require('moment');
const mongo = require("../mongo");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const colors =require("../config/colors.json");

module.exports = async (oldEmoji, newEmoji) =>{


	try {
		let i = guildsCache[oldEmoji.guild.id];
		if(!i){
			await mongo().then(async (mongoose) =>{
				try{ 
					guildsCache[oldEmoji.guild.id] =i= await serversSchema.findOne({_id:oldEmoji.guild.id});
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});
		}
			
		const log = oldEmoji.guild.channels.cache.get(i.logs.serverLog);
		if(log) {
			let embed = makeEmbed("Emoji edited", "", colors.changeBlue, true);
			embed.addFields(
				{name:"Old emoji name:", value: `${oldEmoji.name}`, inline:true},
				{name:"New emoji name:", value: `${newEmoji.name}`, inline:true},
				{name:"Created at:", value:`${moment(oldEmoji.createdAt).fromNow()} /\n${moment(oldEmoji.createdAt).format('MMM Do YY')}`, inline:true},
			);
			log.send({embeds: [embed]}).then(m=> m.react(newEmoji.id));
		}			
	}catch (err) {console.log(err)}

}