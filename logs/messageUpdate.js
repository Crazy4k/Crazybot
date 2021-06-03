const fs = require("fs");
const Discord = require('discord.js');

module.exports = (oldMessage, newMessage) => {
	fs.readFile("./servers.json", 'utf-8', (err, config)=>{		
		try {
			const JsonedDB = JSON.parse(config);
			let i = JsonedDB.find(e=>e.guildId === oldMessage.guild.id);			
			
				if(oldMessage.author.bot) return;

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
	})
	
	
}
