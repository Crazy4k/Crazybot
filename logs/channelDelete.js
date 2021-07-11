
const moment = require('moment');
const Discord = require('discord.js');
const mongo = require("../mongo");
let guildsCache = require("../caches/guildsCache");
const serversSchema = require("../schemas/servers-schema");

module.exports =async(channel) => {
	if(channel.type === 'dm') return;

	try {
		let i = guildsCache[channel.guild.id];
		if(!i){
			await mongo().then(async (mongoose) =>{
				try{ 
					guildsCache[channel.guild.id] =i= await serversSchema.findOne({_id:channel.guild.id});
				} finally{
					console.log("FETCHED FROM DATABASE");
					mongoose.connection.close();
				}
			});
		}

		
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
				
	}catch (err) {console.log(err);}

	
	
}