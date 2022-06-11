const Command = require("../../Classes/Command");
const sendAndDelete = require("../../functions/sendAndDelete");

let pointsRole = new Command("points-role");

pointsRole.set({
    
	aliases         : ["p-role","pointsrole","prole"],
	description     : "Sets the role that will be able to modify other user's points.",
	usage           : "points-role",
	cooldown        : 5,
	unique          : true,
	category        : "points",
	whiteList       : "ADMINISTRATOR",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    options			: [
	],
})



pointsRole.execute = async function(message, args, server, isSlash) { 

    
    sendAndDelete(message, "This command has been moved to the `panel` command", server);         
}

module.exports =pointsRole;