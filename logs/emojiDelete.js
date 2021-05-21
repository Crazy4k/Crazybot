const fs = require("fs");
const makeEmbed = require("../functions/embed");
const moment = require('moment');

module.exports = async emoji =>{
	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		try {
			const JsonedDB = JSON.parse(config);
			for( i of JsonedDB) {
				if (emoji.guild.id === i.guildId) {
					const log = emoji.guild.channels.cache.get(i.logs.serverLog);
					if(typeof log !== 'undefined') {
						let embed = makeEmbed("Emoji deleted", "", "FF0000", true);
						embed.addFields(
							{name:"Emoji name:", value:`${emoji.name}`, inline:true},
							{name:"Emoji ID:", value:`${emoji.id}`, inline:true},
							{name:"Created at:", value:`${moment(emoji.createdAt).fromNow()} /\n${moment(emoji.createdAt).format('MMM Do YY')}`, inline:true},
						);
						log.send(embed);
					}
					break;					
				}
			}		
		}catch (err) {console.log(err)}
	})
}