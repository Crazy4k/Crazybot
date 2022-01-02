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
    let userId = checkUser(message, args);
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

            const robloxBody = await rover(userId).catch(err => isVerified = false);


            let embed;
            if(isVerified){
        
                let roleStatus = false;
                let nicknameStatus = false;
                let extraInfo = [];
                if(server.verifiedRole){
                    
                    let user = message.guild.members.cache.get(userId);
                    let role = message.guild.roles.cache.get(server.verifiedRole);
                    if(role){
                        if(!user.roles.cache.get(server.verifiedRole)){
                        
                            user.roles.add(server.verifiedRole,"auto verified role")
                            .then(yes=> roleStatus = true)
                            .catch(err=> {
                                roleStatus = false;
                                extraInfo.push("Couldn't add the role.");
                            });
                        } else {
                            roleStatus = true;
                        }
                    } else {
                        extraInfo.push("Verified role not found in this server");
                    }
                    
                } else extraInfo.push("Verified role isn't enabled in this server.");
                if(server.forceRobloxNames){
                    let user = message.guild.members.cache.get(userId);

                    user.setNickname(robloxBody.robloxUsername,"auto roblox nickname change")
                    .catch(err=> {
                        nicknameStatus = false;
                        extraInfo.push("Couldn't update the nickname.");
                    });
                    if(user.nickname === robloxBody.robloxUsername){
                        nicknameStatus = true;
                    } else nicknameStatus = false;
                } else extraInfo.push("Roblox nicknames aren't enabled in this server.");
                
        
                embed = makeEmbed(`Roblox status`,``,server,false,"Powered by Rover.link");
                embed.addField("Nickname",`[${nicknameStatus ? "✅" : "❌"}]`,true);
                embed.addField("Roles",`[${roleStatus ? "✅" : "❌"}]`,true);
                if(extraInfo.length)embed.addField("**Extra info**",`${extraInfo.join(",\n")}`,false);
                
            } else{
                let roleStatus = false;
                let nicknameStatus = false;
                let extraInfo = [];

                if(server.verifiedRole){
                    
                    let user = message.guild.members.cache.get(userId);
                    let role = message.guild.roles.cache.get(server.verifiedRole);
                    if(role){
                        if(user.roles.cache.get(server.verifiedRole)){
                        
                            user.roles.remove(server.verifiedRole,"auto verified role")
                            .then(yes=> roleStatus = true)
                            .catch(err=> {
                                roleStatus = false;
                                extraInfo.push("Couldn't remove the role.");
                            });
                            if(!user.roles.cache.get(server.verifiedRole))roleStatus = true;
                        } else {
                            roleStatus = true;
                        }
                    } else {
                        extraInfo.push("Verified role not found in this server");
                    }
                    
                } else extraInfo.push("Verified role isn't enabled in this server.");


                embed = makeEmbed(`Roblox status`,``,server,false,"Powered by Rover.link");
                embed.addField("Nickname",`[${nicknameStatus ? "✅" : "❌"}]`,true);
                embed.addField("Roles",`[${roleStatus ? "✅" : "❌"}]`,true);
                if(extraInfo.length)embed.addField("**Extra info**",`${extraInfo.join(",\n")}`,false);
            }
        
            message.reply({embeds: [embed]}).catch(err=>err);
            return true;

            }
    

};

module.exports = update;