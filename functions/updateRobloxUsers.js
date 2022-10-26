
const getRobloxData = require("./getRobloxData");
const makeEmbed = require("./embed");
const noblox = require("noblox.js");
const botCache = require("../caches/botCache")
const verificationSchema = require("../schemas/verification-schema");
const {robloxVerificationCache} = require("../caches/botCache")
const mongo = require("../mongo");
const updateRobloxUser = require("./updateRobloxUser");


/**
 * Updates a discord role with all its members and syncs them with their Roblox profiles: gives roles and updates nickname to match their Roblox accounts
 * @param {object} message a discord message/user/channel object 
 * @param {object} role A discord role id 
 * @param {object} server The mongoDB-stored server data
 * @param {boolean} isCommandExecution whether or not this has been executed via a command
 * @param {boolean} forceUnverified whether or not to skip fetching user data and treat them as unverified
 * @returns {object} Message Embed with the data regarding the update
 */

module.exports = async (message, roleId, server, isCommandExecution, forceUnverified) =>{
    
    const role = message.guild.roles.cache.get(roleId);
    if(role){

        await role.guild.members.fetch().catch(e=>e);

        await mongo().then(async (mongoose) =>{
            try{ 
                
     
                let data = await verificationSchema.find();

                if(data){
                    for (const item of data) {
                        
                        robloxVerificationCache[item["_id"]] = item;
                        
                    }
                }
                
                
            } catch(error){
                console.log(error);
                
            }finally{
                mongoose.connection.close();
            }
        });

        let count = 0;
        role.members.each(async member => {

            if(!member.user.bot){
                
                count++;
                await updateRobloxUser(message, member.id, server, isCommandExecution, !robloxVerificationCache[member.id], true)
                

            }
            
        });
        return makeEmbed("Success ✅", `${count} users in the <@&${roleId}> role have been updated successfully`, server);
    }
    

    
    


    

};