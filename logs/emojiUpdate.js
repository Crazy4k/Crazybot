const fs = require("fs");
const makeEmbed = require("../functions/embed");
const moment = require('moment');

module.exports = async (oldEmoji, newEmoji) =>{

	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		try {
			const JsonedDB = JSON.parse(config);
			for( i of JsonedDB) {
				if (oldEmoji.guild.id === i.guildId) {
					const log = oldEmoji.guild.channels.cache.get(i.logs.serverLog);
					if(typeof log !== 'undefined') {
						let embed = makeEmbed("Emoji edited", "", "02A3F4", true);
						embed.addFields(
							{name:"Old emoji name:", value:`${oldEmoji.name}`, inline:true},
							{name:"New emoji name:", value:`${newEmoji.name}`, inline:true},
							{name:"Created at:", value:`${moment(oldEmoji.createdAt).fromNow()} /\n${moment(oldEmoji.createdAt).format('MMM Do YY')}`, inline:true},
						);
						log.send(embed).then(m=>m.react(newEmoji.id));
					}	
					break;				
				}
			}		
		}catch (err) {console.log(err)}
	})
}