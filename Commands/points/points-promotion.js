const sendAndDelete = require("../../functions/sendAndDelete");
const Command = require("../../Classes/Command");

let promotion = new Command("points-promotion");

promotion.set({
    
	aliases         : ["promotion-set","rewardsset","rewardset","promotionset","rewards-set","promotions","promotion"],
	description     : "[MOVED TO ;PANEL] shows you the points rewards system for the server.",
	usage           : "rewards-set",
	cooldown        : 5,
	unique          : true,
	category        : "points",
	whiteList       : "ADMINISTRATOR",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    options			: []

})

promotion.execute = async function(message, args, server, isSlash) { 


    sendAndDelete(message, "This command has been moved to the `/panel` command", server);
       
}

module.exports = promotion;
