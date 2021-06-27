const moment = require('moment');
const Discord = require('discord.js'); 

const mongo = require("../mongo");
let guildsCache = require("../caches/guildsCache");
const serversSchema = require("../schemas/servers-schema");

module.exports = async (member)=> {
		console.log("WORK BRO!");
	try {
		let i = guildsCache[member.guild.id];
		if(!i){
			await mongo().then(async (mongoose) =>{
				try{ 
					guildsCache[member.guild.id] =i = await serversSchema.findOne({_id:member.guild.id});
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});
		}
		console.log("The currect cache is:");
		console.log(i);
		console.log(i ===guildsCache[member.guild.id]);
		const room = member.guild.channels.cache.get(i.hiByeChannel);
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
					if(!member.bot){
						if (typeof role !== 'undefined' ) {
							member.roles.add(role).catch(e=>console.log(e));
						}
						if (typeof room !== 'undefined'){
							room.send(`:green_circle:  Welcome <@${member.id}> to the server, have a great time :+1:`).catch(e=> console.log(e));
						}
					}
					
		}catch (err) {console.log(err);}

}