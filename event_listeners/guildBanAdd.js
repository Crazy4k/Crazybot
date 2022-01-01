const makeEmbed = require("../functions/embed");
const mongo = require("../mongo");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const colors =require("../config/colors.json");

module.exports = async (ban, client) =>{
	if(!ban.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR"))return;

	
	try {
		let server = guildsCache[ban.guild.id];
		if(!server){
			await mongo().then(async (mongoose) =>{
				try{ 
					guildsCache[ban.guild.id] = server = await serversSchema.findOne({_id:ban.guild.id});
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});
		}
        
		const log = ban.guild.channels.cache.get(server.logs.warningLog);
		if(log) {
			let embed = makeEmbed("Ban created", `The user <@${ban.user.id}> (${ban.user.id}) has been banned from the server for "${ban.reason ?? "No reason"}"`, colors.failRed, true);
			embed.setAuthor({name: ban.user.tag, iconURL:ban.user.displayAvatarURL()})
			log.send({embeds: [embed]}).catch(e=> console.log(e));
		}
						
	}catch (err) {console.log(err)}
}