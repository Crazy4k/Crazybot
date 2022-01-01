const mongo = require("../mongo");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const colors =require("../config/colors.json");
const makeEmbed = require(".././functions/embed");


module.exports = async(oldRole, newRole, client) => {
	if(!oldRole.guild) return;
	if(!oldRole.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR"))return;

	let server = guildsCache[oldRole.guild.id];
	if(!server){
		await mongo().then(async (mongoose) =>{
			try{ 
				guildsCache[oldRole.guild.id] = server = await serversSchema.findOne({_id:oldRole.guild.id});
			} finally{
				console.log("FETCHED FROM DATABASE");
				mongoose.connection.close();
			}
		});
	}
	
			
    const serverLogs = oldRole.guild.channels.cache.get(server.logs.serverLog);
    if (serverLogs) {

    const changes = [];

    if(oldRole.name !== newRole.name)changes.push(["Name chaned",`Before: ${oldRole.name}\nAfter: ${newRole.name}`]);
    if(oldRole.hexColor !== newRole.hexColor)changes.push(["Color changed", `Before: ${oldRole.hexColor}\nAfter: ${newRole.hexColor}`]);
    if(oldRole.mentionable !== newRole.mentionable)changes.push(["Mentionable status changed",`Before: ${oldRole.mentionable ? "✅" : "❌"}\nAfter: ${newRole.mentionable ? "✅" : "❌"}`]);
    if(oldRole.hoist !== newRole.hoist)changes.push(["Is hoisted?",`Before: ${oldRole.hoist ? "✅" : "❌"}\nAfter: ${newRole.hoist ? "✅" : "❌"}`]);
    let oldPerms = oldRole.permissions.toArray()
    let newPerms = newRole.permissions.toArray()
    const turnedOffPerms = [];
    const turnedOnPerms = [];
    for(let i of oldPerms){
        if(!newPerms[newPerms.indexOf(i)])turnedOffPerms.push(i);
    }
    for(let i of newPerms){
        if(!oldPerms[oldPerms.indexOf(i)])turnedOnPerms.push(i)
    }
    

    if(turnedOffPerms.length || turnedOnPerms.length){
        let str = ``;
        if(turnedOffPerms.length && turnedOnPerms.length){
            str = `Disabled: @${turnedOffPerms.join(",\n")}\n\nEnabled: @${turnedOnPerms.join(",\n")}`
        } else if(turnedOffPerms.length && !turnedOnPerms.length){
            str = `Disabled: @${turnedOffPerms.join(",\n")}`
        } else {
            str =`Enabled: @${turnedOnPerms.join(",\n")}`
        }
        changes.push(["Permissions changed",str]);
    }






    if(changes.length){
        const embed = makeEmbed('role updated',"",colors.changeBlue,true);
        for(let field of changes){
            embed.addField(field[0],field[1],true);
        }
        serverLogs.send({embeds: [embed]}).catch(e=> console.log(e));
    }



       
    }
		
			
		
}