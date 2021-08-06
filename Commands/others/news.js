const makeEmbed = require('../../functions/embed');
const config = require("../../config.json");
const updateObj = require("../../updates.json");

let poopyArray = [];
let int = 0;
for (const item in updateObj) {
	if(int === 5)break;
	if(item !== config.version)poopyArray.push(item);
	int++;
}
poopyArray.reverse();

module.exports = {
	name : 'news',
	aliases:["updates","new",],
	description : "Sends a message that contains a summary of the latest update.",
	cooldown: 30,
	usage:'updates [update (ex: ;updates 0.6.1)]',
    category:"other",
	execute(message, args, server) {

		let update = /*= args[0];*/
		/*if(!update)update = */config.bot_info.version;
		/*let str = updateObj[update];
		if(!str){
			
			const embed = makeEmbed("Invalid value",`The given update value doesn't match`)
			message.channel.send(embed);
		}*/

		
	const embed = makeEmbed(`CrazyBot patch ${update}`,updateObj[update],server,false,"It's advised to use `;sync` after an update");
	embed.addField("Previous updates: ",`\`${poopyArray.join("`, `")}\``,true);
	embed.setURL("https://github.com/Crazy4k/Crazybot");
    message.channel.send(embed).then(m => m.delete({timeout: 2 * 60 * 1000}))
	return true;
	},

};
