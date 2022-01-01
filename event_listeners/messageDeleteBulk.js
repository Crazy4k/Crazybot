const mongo = require("../mongo");
const makeEmbed = require(".././functions/embed");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const colors = require(".././config/colors.json");

module.exports = async (messages, client) => {
	
	
    const message = messages.first();
	if(!message.guild)return;
	if(!message.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR"))return;	
	

    let server = guildsCache[message.guild.id];
    if(!server){
        await mongo().then(async (mongoose) =>{
            try{ 
                guildsCache[message.guild.id] = server = await serversSchema.findOne({_id:message.guild.id});
            } finally{
                console.log("FETCHED FROM DATABASE");
                mongoose.connection.close();
            }
        });
    }
    
    const deleteLogs = message.channel.guild.channels.cache.get(server.logs.warningLog);
	
        
    if(deleteLogs) {
        const embed = makeEmbed('Message delete bulk',`${messages.size} message have just been bulk-deleted from ${message.channel.id}`,colors.pitchBlack,true);
        deleteLogs.send({embeds: [embed]}).catch(e=> console.log(e));
        return;

    }
        
}