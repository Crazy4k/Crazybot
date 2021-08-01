const makeEmbed = require('../../functions/embed');
const config = require("../../config.json");
const updateObj = require("../../updates.json");
module.exports = {
	name : 'updates',
	description : "Sends a message that contains a summary of the latest update.",
	cooldown: 60 * 5,
	usage:'updates [update (ex: ;updates 0.6.1)]',
    category:"other",
	execute(message, args, server) {

		let update = args[0];
		if(!update)update = config.bot_info.version;
		let str = updateObj[update];
		if(!str){
			
			const embed = makeEmbed("Invalid value",`The given update value doesn't match`)
			message.channel.send(embed);
		}

		



	const embed = makeEmbed(`CrazyBot patch ${update}`,updateObj[update],server,false,"It's advised to use `;sync` after an update");
    message.channel.send(embed).then(m => m.delete({timeout: this.cooldown*1000}))
	return true;
	},

};
