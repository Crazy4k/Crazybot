const client = require("../index");
const mongo = require("../mongo");
const makeEmbed = require(".././functions/embed");
let {guildsCache} = require("../caches/botCache");
const serversSchema = require("../schemas/servers-schema");
const colors = require(".././config/colors.json");

module.exports = async (message, client) => {
	
	let isCommand = false;
	if(!message.guild)return;
	if(!message.guild.members.cache.get(client.user.id).permissions.has("ADMINISTRATOR"))return;	
	try {

		let i = guildsCache[message.guild.id];
		if(!i){
			await mongo().then(async (mongoose) =>{
				try{ 
					guildsCache[message.guild.id] =i= await serversSchema.findOne({_id:message.guild.id});
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});
		}
		if (!message.author.bot) {

			const args = message.content.slice(i.prefix.length).split(/ +/);
			const commandName = args.shift().toLowerCase();
					if(client.commands.get(commandName)) isCommand = true;

					const deleteLogs = message.channel.guild.channels.cache.get(i.logs.deleteLog);
					switch (message.channel.id) {
						case i.logs.hiByeLog: 
						case i.logs.deleteLog: 
						case i.logs.serverLog: 
						case i.logs.warningLog: 
						case i.logs.pointsLog:
						case i.logs.eventsLog:
						
						return;	
					}	
					if(message.mentions.members.size > 0 ||message.mentions.roles.size > 0 || message.mentions.everyone ) {
						
						if(deleteLogs) {
							const embed = makeEmbed('Possible ghost ping detected',"",colors.pitchBlack,true);
							let messageContent = message.content;
							if(messageContent.length > 1000) messageContent = "Message content too big to show.";

								embed.setAuthor({name:message.author.username, iconURL:message.author.displayAvatarURL()});
								embed.addFields(
									{ name:'deleted from', value:`<#${message.channel.id}>`, inline: false },
									{ name:'Message content', value: messageContent, inline: false },
									{ name: "Author", value:`<@${message.author.id}>`, inline: false},
									
								);
							deleteLogs.send({embeds: [embed]}).catch(e=> console.log(e));
							return;
					
						}
						return;
						
					}else if(!isCommand) {
						if(typeof deleteLogs !== 'undefined') {
							const embed = makeEmbed('Message deleted',"",colors.failRed,true);
							embed.setAuthor({name:message.author.username, iconURL:message.author.displayAvatarURL()});
							let messageContent = message.content;
							if(messageContent.length > 1000) messageContent = "Message content too big to show.";
							if(messageContent.length === 0) messageContent = "Empty message content";
							embed.addFields(
									{ name:'deleted from', value:`<#${message.channel.id}>`, inline: false },
									{ name:'Message content', value: messageContent, inline: false },
									{ name: "Author", value:`<@${message.author.id}>`, inline: false},
									
								);
							deleteLogs.send({embeds: [embed]}).catch(e=> console.log(e));
							return;
				
						}
					}
				}
			
			
			
		}catch (err) {console.log(err);}

}