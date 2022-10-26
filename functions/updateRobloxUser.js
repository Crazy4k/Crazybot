
const getRobloxData = require("./getRobloxData");
const makeEmbed = require("./embed");
const noblox = require("noblox.js");
const botCache = require("../caches/botCache")



/**
 * Updates a discord user and syncs them with their Roblox profile: gives roles and updates nickname to match their Roblox account
 * @param {object} message A discord guild member 
 * @param {string} userId The discord ID of the guild member
 * @param {object} server The mongoDB-stored server data
 * @param {boolean} isCommandExecution whether or not this has been executed via a command
 * @returns {object} Message Embed with the data regarding the update
 */

module.exports = async (message, userId, server, isCommandExecution, forceUnverified, ignoreOtherRoles) =>{
    return new Promise(async(resolve, reject) => {

    let isVerified = true;
    
    let robloxBody;
    if(forceUnverified) {
        
        robloxBody = 0;
        isVerified = false;
    } else robloxBody = await getRobloxData(userId).catch(err => isVerified = false);  
    


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
            let user = message.guild.members.cache.get(userId);

            await user.setNickname(robloxBody.robloxUsername,"auto roblox nickname change")
            .catch(err=> {
                nicknameStatus = false;
                extraInfo.push("Couldn't update the nickname.");
            });
            if(user.nickname === robloxBody.robloxUsername){
                nicknameStatus = true;
            } else nicknameStatus = false;
        } else extraInfo.push("Roblox nicknames aren't enabled in this server.");
        if(server.robloxBinds && !ignoreOtherRoles){
            
            let robloxGroups = await noblox.getGroups(parseInt(robloxBody.robloxId)).catch(err=>extraInfo.push("Failed to fetch groups"));
            let user = message.guild.members.cache.get(userId);
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
                discordRolesToRemove = [...new Set(discordRolesToRemove)];
                discordRolesToadd = [...new Set(discordRolesToadd)];
                

                discordRolesToRemove.forEach(roleId =>{
                    if(discordRolesToadd.includes(roleId))discordRolesToRemove.splice(discordRolesToRemove.indexOf(roleId),1);
                });


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

        embed = makeEmbed(`Roblox status`,``,server,false,);
        embed.addField("Nickname",`[${nicknameStatus ? "✅" : "❌"}]`,true);
        embed.addField("Roles",`[${roleStatus ? "✅" : "❌"}]`,true);
        if(extraInfo.length)embed.addField("**Extra info**",`${extraInfo.join("\n")}`,false);
        
    } else {

        let roleStatus = false;
        let nicknameStatus = false;
        let extraInfo = [];

        let user = message.guild.members.cache.get(userId);
        let role = message.guild.roles.cache.get(server.verifiedRole) ?? "";

        

        if(server.verifiedRole){
            
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

        discordRolesToRemove = [...new Set(discordRolesToRemove)];
        user.roles.remove(discordRolesToRemove,"auto role")
        .catch(err=> {
            roleStatus = false;
            extraInfo.push("Couldn't add group roles.");
        });

        embed = makeEmbed(`Roblox status`,``,server,false,);
        embed.addField("Nickname",`[${nicknameStatus ? "✅" : "❌"}]`,true);
        embed.addField("Roles",`[${roleStatus ? "✅" : "❌"}]`,true);
        if(extraInfo.length)embed.addField("**Extra info**",`${extraInfo.join("\n")}`,false);
    }
    
   
    return resolve(embed);
});

};