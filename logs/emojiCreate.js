const fs = require("fs");
const makeEmbed = require("../functions/embed");

module.exports = async emoji =>{
	const maker = await emoji.fetchAuthor();
	fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		try {
			const JsonedDB = JSON.parse(config);
			for( i of JsonedDB) {
				if (emoji.guild.id === i.guildId) {
					const log = emoji.guild.channels.cache.get(i.logs.serverLog);
					if(typeof log !== 'undefined') {
						let embed = makeEmbed("Emoji created", "", "3EFF00", true);
						embed.addFields(
							{name:"Emoji name:", value:`${emoji.name}`, inline:true},
							{name:"Emoji ID:", value:`${emoji.id}`, inline:true},
							{name:"Created by:", value:`<@${maker.id}>`, inline:true},
							{name:"Created at:", value:`${emoji.createdAt}`, inline:true},
						);
						log.send(embed).then(m=>m.react(emoji.id));
					}
					break;					
				}
			}		
		}catch (err) {console.log(err)}
	})
}