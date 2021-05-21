const fs = require("fs");
const moment = require('moment');
const Discord = require('discord.js'); 

module.exports = (member)=> {

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (member.guild.id === i.guildId) {

					const room = member.guild.channels.cache.get(i.logs.hiByeChannel);
					const role = member.guild.roles.cache.get(i.hiRole);
					const log = member.guild.channels.cache.get(i.logs.hiByeLog);
			
					if (typeof log !== 'undefined') {
						const embed = new Discord.MessageEmbed()
							.setTitle('member joined')
							.setFooter('Developed by Crazy4K')
							.setTimestamp()
							.setColor('#29C200')
							.setAuthor(member.displayName, member.user.displayAvatarURL())
							.addFields(
								{ name :'account age', value :`${moment(member.user.createdAt).fromNow()} /\n${moment(member.user.createdAt).format('MMM Do YY')}`, inline : true },
								{ name :'member count', value :'#' + member.guild.memberCount, inline : true },
								{ name :'ID', value :member.id, inline : true },
				
							);
				
						log.send(embed);
					}
					fs.readFile("./Commands/points/points.json", 'utf-8', (err, e)=>{
						if(err){
							console.log(err);
							return false;
						}
						const readable = JSON.parse(e);
						for(const server1 of readable){
							if(member.guild.id === server1.guildID){
								server1.members[member.id] = 0;
	
								fs.writeFile("./Commands/points/points.json", JSON.stringify(readable, null, 2), err => {
									if(err) console.log(err);	
								});
								break;
							}
						}
					});
					if(!member.bot){
						if (typeof role !== 'undefined' ) {
							member.roles.add(role).catch(console.error);
						}
						if (typeof room !== 'undefined'){
							room.send(`:green_circle:  Welcome <@${member.id}> to the server, have a great time :+1:`);
						}
					}
					break;
				}
			}
		}catch (err) {console.log(err);}
	})
}