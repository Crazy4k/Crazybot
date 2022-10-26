const Command = require("../../Classes/Command");
const makeEmbed = require("../../functions/embed");
const checkUser = require("../../functions/checkUser");
const updateRobloxUser = require("../../functions/updateRobloxUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const checkRoles = require("../../functions/checkRoles");
const updateRobloxUsers = require("../../functions/updateRobloxUsers");




let update = new Command("update-role");
update.set({
    aliases         : ["updaterole","updater","updateall"],
    description     : "runs the update command on an entire role",
    usage           : "update-role (role)",
    cooldown        : 60 * 10,
    unique          : true,
    category        : "roblox",
    worksInDMs      : false,
    isDevOnly       : false,
    isSlashCommand  : true,
    requiredPerms   : "MANAGE_ROLES",
    whiteList	: "ADMINISTRATOR",
    options			: [
        {
            name : "role",
            description : "Which role to update? (all users included)",
            required : true,
            type: 8,
		}
	],
    
});

update.execute = async function(message, args, server, isSlash) {

    let authorId;
    let target;
    
    if(isSlash){
        authorId = message.user.id;
        target = args[0].value; 
        
    }else {
        authorId = message.author.id;
        target = checkRoles(message, args, 0);
    }
   
    switch (target) {
        case "not valid":
        case "everyone":
        case "not useable":	
        case "no args": 

            const embed1 = makeEmbed('invalid input',this.usage, server);
            sendAndDelete(message,embed1, server);
            return false;
            break;
        
            
        default:
            

        
            const embed69 = await updateRobloxUsers(message, target, server, true, false);  
            message.reply({embeds: [embed69]}).catch(err=>err);

            
            return true;
        
            

    }
    

};

module.exports = update;