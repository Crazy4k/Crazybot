const Command = require("../../Classes/Command");
const makeEmbed = require("../../functions/embed");
const checkUser = require("../../functions/checkUser");
const updateRobloxUser = require("../../functions/updateRobloxUser");
const sendAndDelete = require("../../functions/sendAndDelete");


let update = new Command("update");
update.set({
    aliases         : [],
    description     : "Updates your Discord-to-Roblox status and updates the related roles",
    usage           : "update [user]",
    cooldown        : 5,
    unique          : false,
    category        : "roblox",
    worksInDMs      : false,
    isDevOnly       : false,
    isSlashCommand  : true,
    requiredPerms   : "MANAGE_ROLES",
    options			: [
        {
            name : "user",
            description : "Which user to update?",
            required : false,
            type: 6,
		},
		

	],
    
});

update.execute = async function(message, args, server, isSlash) {

    let authorId;
    let target;
    let userId
    if(isSlash){
        authorId = message.user.id;
        target = args[0]?.value
        target ? userId = target : userId = authorId;

    }else {
        authorId = message.author.id;
        target = args[0];
        userId = checkUser(message, args);
    }
   
    switch (userId) {
        case "not valid":
        case "everyone":
        case "not useable":	
        
            sendAndDelete(message,makeEmbed('invalid input',this.usage, server), server);
            return false;

        case "no args": 
            userId = authorId;
        default:             

       
        let embed = await updateRobloxUser(message, userId, server, true, false, false);       
    
        message.reply({embeds: [embed]}).catch(err=>err);
        return true;

    }
    

};

module.exports = update;