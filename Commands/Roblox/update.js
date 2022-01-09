const Command = require("../../Classes/Command");
const makeEmbed = require("../../functions/embed");
const checkUser = require("../../functions/checkUser");
const updateRobloxUser = require("../../functions/updateRobloxUser");


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
    options			: [
        {
            name : "user",
            description : "Which user to update?",
            required : false,
            type: 6,
		},
		

	],
    
});

update.execute = async (message, args, server, isSlash) =>{

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
            
            const embed1 = makeEmbed('invalid username',this.usage, server);
            sendAndDelete(message,embed1, server);
            return false;
            break;
        case "no args": 
            userId = authorId;
        default:

            let embed = await updateRobloxUser(message, userId, server, true);       
        
            message.reply({embeds: [embed]}).catch(err=>err);
            return true;

            }
    

};

module.exports = update;