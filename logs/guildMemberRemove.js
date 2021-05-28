const fs = require("fs");
const moment = require('moment');
const Discord = require('discord.js');
const client = require("../index");

module.exports = (member) => {


	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
		try {
			const JsonedDB = JSON.parse(config);
			
			for( i of JsonedDB) {
				if (member.guild.id === i.guildId) {

					const ByeChannel = client.channels.cache.get(i.hiByeChannel);
					const log = member.guild.channels.cache.get(i.logs.hiByeLog);
				
					if (typeof log !== 'undefined') {
						const embed = new Discord.MessageEmbed()
							.setTitle('member left')
							.setFooter('Developed by Crazy4K')
							.setTimestamp()
							.setColor('#DB0000')
							.setAuthor(member.displayName, member.user.displayAvatarURL())
							.addFields(
								{ name :'account age', value :`${moment(member.user.createdAt).fromNow()} /\n${moment(member.user.createdAt).format('MMM Do YY')}`, inline : true },
								{ name :'joined at', value :`${moment(member.joinedAt).fromNow()} /\n${moment(member.joinedAt).format('MMM Do YY')}`, inline : true },
								{ name :'ID', value :member.id, inline : true },
				
							);
						log.send(embed);
					
					}
					if (typeof ByeChannel !== 'undefined'){
						ByeChannel.send(`:red_circle:  <@${member.nickname}>  just left the server, bye bye :wave:`);
					}
					break;
				}
			}
		}catch (err) {console.log(err);}
	})
}