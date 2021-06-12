const moment = require('moment');
const Discord = require('discord.js');
const client = require("../index");
const mongo = require("../mongo");
let guildsCache = require("../caches/guildsCache");
const serversSchema = require("../schemas/servers-schema");


module.exports = async (member) => {
		
	try {
			
			
		let i = guildsCache[member.guild.id];
		if(!i){
			await mongo().then(async (mongoose) =>{
				try{ 
					guildsCache[member.guild.id] =i= await serversSchema.findOne({_id:member.guild.id});
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});
		}
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
			ByeChannel.send(`:red_circle:  <@${member.id}>  just left the server, bye bye :wave:`);
		}
				
			
	}catch (err) {console.log(err);}

}