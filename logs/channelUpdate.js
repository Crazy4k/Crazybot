const mongo = require("../mongo");
let guildsCache = require("../caches/guildsCache");
const serversSchema = require("../schemas/servers-schema");
const makeEmbed = require(".././functions/embed");

module.exports = async(oldChannel, newChannel)=> {
	if(oldChannel.type === 'dm') return;
	try {
		let i = guildsCache[oldChannel.guild.id];
		if(!i){
			await mongo().then(async (mongoose) =>{
				try{ 
					guildsCache[oldChannel.guild.id] =i= await serversSchema.findOne({_id:oldChannel.guild.id});
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});
		}
		const serverLogs = oldChannel.guild.channels.cache.get(i.logs.serverLog);		
					if(typeof serverLogs !== 'undefined') {
						try {
							const tur = [];
							let oldPerms = oldChannel.permissionOverwrites.array();
							let newPerms = newChannel.permissionOverwrites.array();
							if(oldPerms.length !== newPerms.length)tur.push('permissionss');
							else {
								let bool = false;
								for (let i = 0; i < oldPerms.length; i++) {
									const oldElement = oldPerms[i];
									const newElement = newPerms[i];
									if(oldElement.deny.bitfield !== newElement.deny.bitfield || oldElement.allow.bitfield !== newElement.allow.bitfield){
										bool = true;
										break;
									}
								}
								if(bool)tur.push('permissionss');
							}
							if(oldChannel.name !== newChannel.name)tur.push('name');
							if(oldChannel.parentID !== newChannel.parentID)tur.push('category');
							if(oldChannel.nsfw === true && newChannel.nsfw === false || oldChannel.nsfw === false && newChannel.nsfw === true)tur.push('NSFW');
							if(!tur.length)return;
							let embed = makeEmbed("Channel edited","","02A3F4",true);
							embed.addFields(
									{ name:'Channel', value:`${oldChannel}`, inline:true },
									{ name:'ID', value:oldChannel.id, inline:true },
								);

							for (const e of tur) {
								if(e === 'name') {
									embed.addField('Channel name changed 🔤', `before: ${oldChannel.name} \nafter: ${newChannel.name}`, false);
								}
								if(e === 'NSFW') {
									embed.addField('NSFW status changed 🔞', `before: ${oldChannel.nsfw} \nafter: ${newChannel.nsfw}`, false);
								}
								if(e === 'category') {
									embed.addField('Category changed :arrow_double_up:', `before: ${oldChannel.parent} \nafter: ${newChannel.parent}`, false);
								}
								if(e === "permissionss"){
									embed.addField('Permissions modified ✅❌', "`No Info`", false);
								}
							}
							serverLogs.send(embed);
						} catch(error) {
							console.error;
						}
					}
					
		}catch (err) {console.log(err);}
	
	
}