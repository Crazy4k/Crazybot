
const fs = require("fs");
const moment = require('moment');
const Discord = require('discord.js');

module.exports =(channel) => {
	if(channel.type === 'dm') return;
	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
			try {
			const JsonedDB = JSON.parse(config);
			for( i of JsonedDB) {
				if (channel.guild.id === i.guildId) {
					const serverLogs = channel.guild.channels.cache.get(i.logs.serverLog);
					if (typeof serverLogs !== 'undefined') {
						const embed = new Discord.MessageEmbed()
							.setColor('#DB0000')
							.setFooter('Developed by Crazy4k')
							.setTimestamp()
							.setTitle('Channel Deleted')
							.addFields(
								{ name:'name', value:channel.name, inline: false },
								{ name:'Category', value:channel.parent, inline: false },
								{ name:'created at', value:`${moment(channel.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`, inline: false },
								{ name:'ID', value: channel.id, inline: false },
							);
						serverLogs.send(embed);
					}
					break;
				}
				
			}	
		}catch (err) {console.log(err);}
	})
	
	
}