const makeEmbed = require("../functions/embed");
const mongo = require("../mongo");
let guildsCache = require("../caches/guildsCache");
const serversSchema = require("../schemas/servers-schema");

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
		if(typeof log !== 'undefined') {
			let embed = makeEmbed("Emoji created", "", "3EFF00", true);
			embed.addFields(
				{name:"Emoji name:", value:`${emoji.name}`, inline:true},
				{name:"Emoji ID:", value:`${emoji.id}`, inline:true},
				{name:"Created by:", value:`<@${maker.id}>`, inline:true},
				{name:"Created at:", value:`${emoji.createdAt}`, inline:true},
			);
			log.send(embed).then(m=>m.react(emoji.id));
		}
						
	}catch (err) {console.log(err)}
}