const fs = require("fs");
const Discord = require('discord.js');
const client = require("../index");


module.exports = (message) => {
	
	let isCommand = false;

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			let i = JsonedDB.find(e=>e.guildId === message.guild.id);
		
				if (i && !message.author.bot) {

					const args = message.content.slice(i.prefix.length).split(/ +/);
					const commandName = args.shift().toLowerCase();
					if(client.commands.get(commandName)) isCommand = true;

					const deleteLogs = message.channel.guild.channels.cache.get(i.logs.deleteLog);
					switch (message.channel.id) {
						case i.logs.hiByeLog: 
						case i.logs.deleteLog: 
						case i.logs.serverLog: 
						case i.logs.warningLog: 
						
						return;	
					}	
					if(message.mentions.members.size > 0 ||message.mentions.roles.size > 0 || message.mentions.everyone ) {
						
						if(deleteLogs) {
							const embed = new Discord.MessageEmbed()
								.setAuthor(message.author.username, message.author.displayAvatarURL())
								.setTitle('Possible ghost ping detected')
								.setFooter('Developed by Crazy4K')
								.setTimestamp()
								.setColor('#000000')
								.addFields(
									{ name:'deleted from', value:message.channel, inline:false},
									{ name:'Message content', value:message.content, inline: false },
									{ name: "Author", value:`<@${message.author.id}>`, inline: false },
									
								);
							deleteLogs.send(embed);
							return;
					
						}
						return;
						
					}else if(!isCommand) {
						if(typeof deleteLogs !== 'undefined') {
							const embed = new Discord.MessageEmbed()
								.setAuthor(message.author.username, message.author.displayAvatarURL())
								.setTitle('Message deleted')
								.setFooter('Developed by Crazy4K')
								.setTimestamp()
								.setColor('#DB0000')
								.addFields(
									{ name:'deleted from', value:message.channel, inline: false },
									{ name:'Message content', value:message.content, inline: false },
									{ name: "Author", value:`<@${message.author.id}>`, inline: false},
									
								);
							deleteLogs.send(embed);
							return;
				
						}
					}
				}
			
			
			
		}catch (err) {console.log(err);}
	})
}