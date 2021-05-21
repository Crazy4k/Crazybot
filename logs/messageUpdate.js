const fs = require("fs");
const Discord = require('discord.js');

module.exports = (oldMessage, newMessage) => {
	fs.readFile("./servers.json", 'utf-8', (err, config)=>{		
		try {
			const JsonedDB = JSON.parse(config);			
			for( i of JsonedDB) {
				if (oldMessage.guild.id === i.guildId) {
					if(oldMessage.author.bot || oldMessage.content.startsWith(i.prefix)) return;
					const deleteLogs = oldMessage.channel.guild.channels.cache.get(i.logs.deleteLog);
					if(typeof deleteLogs !== 'undefined') {
						const embed = new Discord.MessageEmbed()
							.setAuthor(oldMessage.author.username, oldMessage.author.displayAvatarURL())
							.setTitle('Message edited')
							.setFooter('Developed by Crazy4K')
							.setTimestamp()
							.setColor('#02A3F4')
							.addFields(
								{ name:'edited on', value:oldMessage.channel, inline:true },
								{ name:'Before', value:oldMessage.content, inline: false },
								{ name:'After', value:newMessage.content, inline: false },
							);
						deleteLogs.send(embed);
					}
					break;
					//statments here
				}
			}
			
			
		}catch (err) {console.log(err);}
	})
	
	
}
