const fs = require("fs");
const Discord = require('discord.js');


module.exports = (message) => {
	

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			let i = JsonedDB.find(e=>e.guildId === message.guild.id);
		
				if (i && !message.author.bot) {

					const deleteLogs = message.channel.guild.channels.cache.get(i.logs.deleteLog);
					switch (message.channel.id) {
						case i.logs.hiByeLog: 
						case i.logs.deleteLog: 
						case i.logs.serverLog: 
						case i.logs.warningLog: return;	
					}	
					if(message.mentions.members.size > 0 ||message.mentions.roles.size > 0 || message.mentions.everyone ) {
						
						if(deleteLogs) {
							const embed = new Discord.MessageEmbed()
								.setAuthor(message.author.username, message.author.displayAvatarURL())
								.setTitle('Possible ghost ping detected.')
								.setFooter('Developed by Crazy4K')
								.setTimestamp()
								.setColor('#000000')
								.addFields(
									{ name:'deleted from', value:message.channel, inline:true },
									{ name:'Message content', value:message.content, inline: true },
									{ name: "Author", value:`<@${message.author.id}>`, inline: true}
								);
							deleteLogs.send(embed);
					
						}
						return;
						
					}else
					
					if(!message.content.startsWith(i.prefix)) {
						if(typeof deleteLogs !== 'undefined') {
							const embed = new Discord.MessageEmbed()
								.setAuthor(message.author.username, message.author.displayAvatarURL())
								.setTitle('Message deleted')
								.setFooter('Developed by Crazy4K')
								.setTimestamp()
								.setColor('#DB0000')
								.addFields(
									{ name:'deleted from', value:message.channel, inline:true },
									{ name:'Message content', value:message.content, inline: false },
									{ name: "Author", value:`<@${message.author.id}>`, inline: true}
								);
							deleteLogs.send(embed);
				
						}
					}
				}
			
			
			
		}catch (err) {console.log(err);}
	})
}