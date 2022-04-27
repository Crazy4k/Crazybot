
const config = require("../config/config.json");
const makeEmbed = require("../functions/embed");
const colors = require("../config/colors.json");

module.exports = async (rateLimit, client) => {

    try {
		
        let log = client.channels.cache.get(config.bot_info.clientLogs);
		if(log){
			const embed = makeEmbed("A rate limit happened",JSON.stringify(rateLimit), colors.pink,true);
			log.send({embeds:[embed]}).catch(e=>console.log(e))
            console.log("A rate limit happened!");
            console.log("rateLimit data:", rateLimit);
		}
		
	} catch (err) {
		console.log(err);
	}



}