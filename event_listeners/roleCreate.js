const mongo = require("../mongo");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const colors =require("../config/colors.json");
const makeEmbed = require(".././functions/embed");


module.exports = async(role, client) => {
	if(!role.guild) return;
	if(!role.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR"))return;

	let server = guildsCache[role.guild.id];
	if(!server){
		await mongo().then(async (mongoose) =>{
			try{ 
				guildsCache[role.guild.id] = server = await serversSchema.findOne({_id:role.guild.id});
			} finally{
				console.log("FETCHED FROM DATABASE");
				mongoose.connection.close();
			}
		});
	}
		
   
			
    const serverLogs = role.guild.channels.cache.get(server.logs.serverLog);
    if (serverLogs) {
        const embed = makeEmbed('role created',"",colors.successGreen,true);
            embed.addFields(
                { name:'Name', value: role.name, inline: false },
                { name:'ID', value: `${role.id}`, inline: false },
                { name:'Created at', value: `<t:${parseInt(role.createdTimestamp / 1000)}:F>\n<t:${parseInt(role.createdTimestamp / 1000)}:R>`, inline: false },
            );
        serverLogs.send({embeds: [embed]}).catch(e=> console.log(e));
    }
		
			
	
}