const Discord = require('discord.js');
const mongo = require("../mongo");
let guildsCache = require("../caches/guildsCache");
const serversSchema = require("../schemas/servers-schema");

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
							if(oldChannel.permissionOverwrites.array()[0].deny.bitfield !== newChannel.permissionOverwrites.array()[0].deny.bitfield || oldChannel.permissionOverwrites.array()[0].allow.bitfield !== newChannel.permissionOverwrites.array()[0].allow.bitfield)tur.push('permissionss');
							if(oldChannel.name !== newChannel.name)tur.push('name');
							if(oldChannel.parentID !== newChannel.parentID)tur.push('category');
							if(oldChannel.nsfw === true && newChannel.nsfw === false || oldChannel.nsfw === false && newChannel.nsfw === true)tur.push('NSFW');
							if(!tur.length)return;
							let embed = new Discord.MessageEmbed()
								.setFooter('Developed by Crazy4K')
								.setTimestamp()
								.setColor('#02A3F4')
								.setTitle('Channel edited')
								.addFields(
									{ name:'Channel', value:`<#${oldChannel.id}>`, inline:true },
									{ name:'ID', value:oldChannel.id, inline:true },
								);

							for (const e of tur) {
								if(e === 'name') {
									embed.addField('Channel name changed :eye:', `before: ${oldChannel.name} \nafter: ${newChannel.name}`, false);
								}
								if(e === 'NSFW') {
									embed.addField('NSFW status changed :underage:', `before: ${oldChannel.nsfw} \nafter: ${newChannel.nsfw}`, false);
								}
								if(e === 'category') {
									embed.addField('Category changed :arrow_double_up:', `before: ${oldChannel.parent} \nafter: ${newChannel.parent}`, false);
								}
							}
							serverLogs.send(embed);
						} catch(error) {
							console.error;
						}
					}
					
		}catch (err) {console.log(err);}
	
	
}