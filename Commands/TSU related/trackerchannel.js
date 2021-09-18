/*const makeEmbed = require("../../functions/embed");
const checkChannels = require("../../functions/Response based Checkers/checkChannels");
const mongo = require("../../mongo");
let raiderTrakcerchannelsCache = require("../../caches/raiderTrakcerchannelsCache");
const raiderTrackerSchema = require("../../schemas/raiderTracker-schema");


module.exports = {
	name : 'tracker-channel',
	description : "Sets the channel that will send pings when raiders join (raider tracker).",
    cooldown: 30 ,
    aliases:["trackerchannel","trackerc"],
	usage:'tracker-channel',
    category:"ms",
    whiteList:'ADMINISTRATOR',
	async execute(message, args, server) { 

        let channelIds = raiderTrakcerchannelsCache.channels;

            
            
        if(!server.hostRole || server.hostRole === ""){

        
            const embed = makeEmbed("White listed role.",`Ping the role that you want to be able to use the host command.\nType \`no\` for no one except admins.`, server);
        
            message.channel.send({embeds: [embed]});
            const messageFilter = m => !m.author.bot && m.author.id === message.author.id;
            message.channel.awaitMessages({filter: messageFilter, max: 1, time : 120000, errors: ['time']})
                .then(async (a) => {
                    let checkedRole = checkRoles(a);
                    switch (checkedRole) {
                        case "not valid":
                        case "not useable":
                        case "no args":               
                            message.channel.send("Invalid argument, command failed.");
                            return false;
                            break;
                        case "cancel":
                        case "no":
                           servery.hostRole = "";
                           break;
                        default:     
                            servery.hostRole = checkedRole;
                            break;
                        }                                        

                        await mongo().then(async (mongoose) =>{
                            try{
                                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                    hostRole: servery.hostRole
                                },{upsert:true});
                            } finally{
                                console.log("WROTE TO DATABASE");
                                mongoose.connection.close();
                            }
                        })
                        cache[message.guild.id] = servery;

                        const embed = makeEmbed(`✅ Host role has been updated.`,`Poeple with the role <@&${servery.hostRole}> can now use the command !host`, "#24D900");
                        message.channel.send({embeds: [embed]});
                        return true;
                });
        } else{
            const embed = makeEmbed(`You already have a host role set.`,`**Type \`reset\` to reset it..**`, server);
            message.channel.send({embeds: [embed]});
            const gayFilter = m => !m.author.bot && m.author.id === message.author.id;
            message.channel.awaitMessages({filter: gayFilter,max: 1, time : 20000, errors: ['time']})
            .then(async (a) => {
                if(a.first().content === "reset"){
                    await mongo().then(async (mongoose) =>{
                        try{ 
                            await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                hostRole: ""
                            },{upsert:true});
                            cache[message.guild.id] = servery;
                        } finally{
                            message.channel.send("Role has been reset");
                            console.log("WROTE TO DATABASE");
                            mongoose.connection.close();
                        }
                    });
                    return true;
                    
                }else return false;
            })
            
        }           
    }
};
*/