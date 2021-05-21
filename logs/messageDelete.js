const fs = require("fs");
const Discord = require('discord.js');


module.exports = (message) => {
	

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (message.guild.id === i.guildId) {

					const deleteLogs = message.channel.guild.channels.cache.get(i.logs.deleteLog);
					switch (message.channel.id) {
						case i.logs.hiByeLog: 
						case i.logs.deleteLog: 
						case i.logs.serverLog: 
						case i.logs.warningLog: return;	
					}	
					if(message.author.bot || message.content.startsWith(i.prefix)) return;	
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
							);
						deleteLogs.send(embed);
				
					}
					if (typeof ByeChannel !== 'undefined'){
						ByeChannel.send(`:red_circle:  <@${member.id}>  just left the server, bye bye :wave:`);
					}
					break;
				}
			}
			
			
		}catch (err) {console.log(err);}
	})
}