
const rover = require("rover-api");
const makeEmbed = require("./embed");
const noblox = require("noblox.js");





module.exports = async (member, userId, server, isCommandExecution) =>{

    let isVerified = true;
    
    const robloxBody = await rover(userId).catch(err => isVerified = false);


    let embed;
    if(isVerified){

        let roleStatus = false;
        let nicknameStatus = false;
        let extraInfo = [];
        if(server.verifiedRole){
            
            let user = member.guild.members.cache.get(userId);
            let role = member.guild.roles.cache.get(server.verifiedRole);
            if(role){
                if(!user.roles.cache.get(server.verifiedRole)){
                    
                    await user.roles.add(server.verifiedRole,"auto verified role")
                    .catch(err=> {
                        roleStatus = false;
                        extraInfo.push("Couldn't add the role.");
                    });
                    if(user.roles.cache.get(server.verifiedRole)) roleStatus = true;
                } else {
                    roleStatus = true;
                }
            } else {
                extraInfo.push("Verified role not found in this server");
            }
            
        } else extraInfo.push("Verified role isn't enabled in this server.");
        if(server.forceRobloxNames){
            let user = member.guild.members.cache.get(userId);

            await user.setNickname(robloxBody.robloxUsername,"auto roblox nickname change")
            .catch(err=> {
                nicknameStatus = false;
                extraInfo.push("Couldn't update the nickname.");
            });
            if(user.nickname === robloxBody.robloxUsername){
                nicknameStatus = true;
            } else nicknameStatus = false;
        } else extraInfo.push("Roblox nicknames aren't enabled in this server.");
        if(server.robloxBinds){
            
            let robloxGroups = await noblox.getGroups(robloxBody.robloxId).catch(err=>extraInfo.push("Failed to fetch groups"));
            let user = member.guild.members.cache.get(userId);
            if(robloxGroups && user){

                let discordRolesToadd = [];
                let discordRolesToRemove = [];

                for(let group of robloxGroups){
                    if(server.robloxBinds[group.Id]){

                        if(server.robloxBinds[group.Id]){
                            discordRolesToadd.push(...server.robloxBinds[group.Id][group.RoleId]);
                            discordRolesToadd.push(...server.robloxBinds[group.Id][group.Id]);
                        }
                    }
                }

                for(let groupId in server.robloxBinds){
                    
                    for(let roleId in server.robloxBinds[groupId]){
                        if(server.robloxBinds[groupId][roleId].length)discordRolesToRemove.push(...server.robloxBinds[groupId][roleId]); 
                        
                    }
                    
                }

                user.roles.remove(discordRolesToRemove,"auto role")
                .then(yes =>{
                    user.roles.add(discordRolesToadd,"auto role")
                    .catch(err=> {
                        roleStatus = false;
                        extraInfo.push("Couldn't add group roles.");
                    });
                })
                .catch(err=> {
                    roleStatus = false;
                    extraInfo.push("Couldn't add group roles.");
                });



            }
            
        } 

        embed = makeEmbed(`Roblox status`,``,server,false,"Powered by Rover.link");
        embed.addField("Nickname",`[${nicknameStatus ? "✅" : "❌"}]`,true);
        embed.addField("Roles",`[${roleStatus ? "✅" : "❌"}]`,true);
        if(extraInfo.length)embed.addField("**Extra info**",`${extraInfo.join("\n")}`,false);
        
    } else if(isCommandExecution){
        let roleStatus = false;
        let nicknameStatus = false;
        let extraInfo = [];

        if(server.verifiedRole){
            
            let user = member.guild.members.cache.get(userId);
            let role = member.guild.roles.cache.get(server.verifiedRole);
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
            
        } else extraInfo.push("Verified role isn't set up in this server.");

        let discordRolesToRemove = [];
        for(let groupId in server.robloxBinds){
            
            for(let roleId in server.robloxBinds[groupId]){
                if(server.robloxBinds[groupId][roleId].length)discordRolesToRemove.push(...server.robloxBinds[groupId][roleId]); 
                
            }
            
        }
        user.roles.remove(discordRolesToRemove,"auto role")
        .catch(err=> {
            roleStatus = false;
            extraInfo.push("Couldn't add group roles.");
        });

        embed = makeEmbed(`Roblox status`,``,server,false,"Powered by Rover.link");
        embed.addField("Nickname",`[${nicknameStatus ? "✅" : "❌"}]`,true);
        embed.addField("Roles",`[${roleStatus ? "✅" : "❌"}]`,true);
        if(extraInfo.length)embed.addField("**Extra info**",`${extraInfo.join("\n")}`,false);
    }
    
   
    return embed;

        
    

};

