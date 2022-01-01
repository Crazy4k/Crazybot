const Command = require("../../Classes/Command");
const rover = require("rover-api");
const makeEmbed = require("../../functions/embed");
const checkUser = require("../../functions/checkUser");



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

    let isVerified = true;
    let authorId;
    let target;
    if(isSlash){
        authorId = message.user.id;
        target = args[0]?.value

    }else {
        authorId = message.author.id;
        target = args[0];
    }
    let user = checkUser(message, args);
    switch (user) {
        case "not valid":
        case "everyone":	
        case "not useable":
            
            const embed1 = makeEmbed('invalid username',this.usage, server);
            sendAndDelete(message,embed1, server);
            return false;
            break;
        case "no args": 
            user = authorId;
        default:
            console.log(user);
            const robloxBody = await rover(user).catch(err => isVerified = false);


            let embed;
            if(isVerified){
        
                let role = false;
                let nickname = false;
                if(server.verifiedRole){
                    
                    let member = message.guild.members.cache.get(authorId);
                    if(!member.roles.cache.get(server.verifiedRole)){
                        
                        member.roles.add(server.verifiedRole,"auto verified role")
                        .then(yes=> role = true)
                        .catch(err=> role = false);
                    } else role = true;
                }
                if(server.forceRobloxNames){
                    let member = message.guild.members.cache.get(authorId);

                    member.setNickname(robloxBody.robloxUsername,"auto roblox nickname change")
                    .then(yes=> nickname = true)
                    .catch(err=> nickname = false);
                }
                
        
                embed = makeEmbed(`Roblox status`,``,server,false,"Powered by Rover.link");
                embed.addField("Nickname",`[${nickname ? "✅" : "❌"}]`,true);
                embed.addField("Roles",`[${role ? "✅" : "❌"}]`,true);
                
            } else{
                embed = makeEmbed(`You're not verified!`,`Click [HERE](https://rover.link/my/verification) to verify and link your Roblox account!\n After you've verified, you can run the \`;update\` command to apply the changes`,server,false,"Powered by Rover.link");
            }
        
            message.reply({embeds: [embed]}).catch(err=>err);
            return true;

            }
    

};

module.exports = update;