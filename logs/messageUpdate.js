const Discord = require('discord.js');
const mongo = require("../mongo");
let guildsCache = require("../caches/guildsCache");
const serversSchema = require("../schemas/servers-schema");

module.exports = async(oldMessage, newMessage) => {

		try{			
			if(oldMessage.author.bot) return;

			let i = guildsCache[oldMessage.guild.id];
			if(!i){
				await mongo().then(async (mongoose) =>{
					try{ 
						guildsCache[oldMessage.guild.id] =i= await serversSchema.findOne({_id:oldMessage.guild.id});
					} finally{
						console.log("FETCHED FROM DATABASE");
						mongoose.connection.close();
					}
				});
			}

				const deleteLogs = oldMessage.channel.guild.channels.cache.get(i.logs.deleteLog);

				const oldHasPing = oldMessage.mentions.members.size > 0 ||oldMessage.mentions.roles.size > 0 || oldMessage.mentions.everyone;
				const newHasPing = newMessage.mentions.members.size > 0 ||newMessage.mentions.roles.size > 0 || newMessage.mentions.everyone;

				if(oldHasPing && !newHasPing ) {
						
					if(deleteLogs) {
						const embed = new Discord.MessageEmbed()
							.setAuthor(oldMessage.author.username, oldMessage.author.displayAvatarURL())
							.setTitle('Possible ghost ping detected')
							.setFooter('Developed by Crazy4K')
							.setTimestamp()
							.setColor('#000000')
							.addFields(
								{ name:'edited on', value:oldMessage.channel, inline:false },
								{ name:'Before', value:oldMessage.content, inline: false },
								{ name:'After', value:newMessage.content, inline: false },
								{ name: "Author", value:`<@${oldMessage.author.id}>`, inline: false },
								{ name:"Message link :e_mail:", value:`[message](${oldMessage.url} "message link")`, inline: false}
								
							);
						deleteLogs.send(embed);
						return;
				
					}
					return;
					
				} else if(deleteLogs) {
					const embed = new Discord.MessageEmbed()
						.setAuthor(oldMessage.author.username, oldMessage.author.displayAvatarURL())
						.setTitle('Message edited')
						.setFooter('Developed by Crazy4K')
						.setTimestamp()
						.setColor('#02A3F4')
						.addFields(
							{ name:'edited on', value:oldMessage.channel, inline:false },
							{ name:'Before', value:oldMessage.content, inline: false },
							{ name:'After', value:newMessage.content, inline: false },
							{ name: "Author", value:`<@${oldMessage.author.id}>`, inline: false },
							{ name:"Message link :e_mail:", value:`[message](${oldMessage.url} "message link")`, inline: false}
						);
					deleteLogs.send(embed);
				}			
			
			
		}catch (err) {console.log(err);}

	
	
}
