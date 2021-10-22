const mongo = require("../mongo");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const makeEmbed =require("../functions/embed");
const colors = require("../config/colors.json");

module.exports = async(oldMessage, newMessage, client) => {

		try{			
			if(!oldMessage.guild)return;
			if(oldMessage.author.bot) return;
			if(!oldMessage.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR"))return;	
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

						let beforeContent = oldMessage.content;
						let afterContent = newMessage.content;
						if(beforeContent.length > 1000) beforeContent = "Message content too big to show.";
						if(afterContent.length > 1000) afterContent = "Message content too big to show.";
						
						embed.addFields(
								{ name: 'edited on', value: `<#${oldMessage.channel.id}>`, inline:false },
								{ name: 'Before', value: beforeContent, inline: false },
								{ name: 'After', value: afterContent, inline: false },
								{ name: "Author", value: `<@${oldMessage.author.id}>`, inline: false },
								{ name: "Message link :e_mail:", value: `[message](${oldMessage.url} "message link")`, inline: false}
								
							);
						deleteLogs.send({embeds:[embed]});
						return;
				
					}
					return;
					
				} else if(deleteLogs && oldMessage.content !== newMessage.content) {
					const embed = makeEmbed("Message edited","",colors.changeBlue,true);
					let beforeContent = oldMessage.content;
					let afterContent = newMessage.content;
					if(beforeContent.length > 1000) beforeContent = "Message content too big to show.";
					if(afterContent.length > 1000) afterContent = "Message content too big to show.";
					if(beforeContent.length === 0) beforeContent = "Empty message content";
					if(afterContent.length === 0) afterContent = "Empty message content";

					embed.setAuthor(oldMessage.author.username, oldMessage.author.displayAvatarURL())
						.addFields(
							{ name:'edited on', value: `<#${oldMessage.channel.id}>`, inline:false },
							{ name:'Before', value: beforeContent, inline: false },
							{ name:'After', value: afterContent, inline: false },
							{ name: "Author", value: `<@${oldMessage.author.id}>`, inline: false },
							{ name:"Message link :e_mail:", value: `[message](${oldMessage.url} "message link")`, inline: false}
						);
					deleteLogs.send({embeds: [embed]}).catch(e=> console.log(e));
				}			
			
			
		}catch (err) {console.log(err);}

	
	
}
