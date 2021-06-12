const Discord = require('discord.js');
const client = require("../index");
const mongo = require("../mongo");
let guildsCache = require("../caches/guildsCache");
const serversSchema = require("../schemas/servers-schema");

module.exports =async (message) => {
	
	let isCommand = false;	
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

}