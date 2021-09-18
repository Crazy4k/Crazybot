const mongo = require("../mongo");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const makeEmbed =require("../functions/embed");
const colors = require("../colors.json");

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
						const embed = makeEmbed('Possible ghost ping detected',"",colors.pitchBlack,true);
						embed.setAuthor(oldMessage.author.username, oldMessage.author.displayAvatarURL());	
						embed.addFields(
								{ name: 'edited on', value: `<#${oldMessage.channel.id}>`, inline:false },
								{ name: 'Before', value: oldMessage.content, inline: false },
								{ name: 'After', value: newMessage.content, inline: false },
								{ name: "Author", value: `<@${oldMessage.author.id}>`, inline: false },
								{ name: "Message link :e_mail:", value: `[message](${oldMessage.url} "message link")`, inline: false}
								
							);
						deleteLogs.send({embeds:[embed]});
						return;
				
					}
					return;
					
				} else if(deleteLogs && oldMessage.content !== newMessage.content) {
					const embed = makeEmbed("Message edited","",colors.changeBlue,true);
					embed.setAuthor(oldMessage.author.username, oldMessage.author.displayAvatarURL())
						.addFields(
							{ name:'edited on', value: `<#${oldMessage.channel.id}>`, inline:false },
							{ name:'Before', value: oldMessage.content, inline: false },
							{ name:'After', value: newMessage.content, inline: false },
							{ name: "Author", value: `<@${oldMessage.author.id}>`, inline: false },
							{ name:"Message link :e_mail:", value: `[message](${oldMessage.url} "message link")`, inline: false}
						);
					deleteLogs.send({embeds: [embed]});
				}			
			
			
		}catch (err) {console.log(err);}

	
	
}
