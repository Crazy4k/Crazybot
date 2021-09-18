const makeEmbed = require("../functions/embed");
const mongo = require("../mongo");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const colors =require("../colors.json");
const moment = require('moment');

module.exports = async (emoji) =>{
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
				{name:"Created at:", value: `${moment(emoji.createdAt).fromNow()} /\n${moment(emoji.createdAt).format('MMM Do YY')}`, inline:true},
			);
			log.send({embeds: [embed]}).then(m=>m.react(emoji.id));
		}
						
	}catch (err) {console.log(err)}
}