/*const makeEmbed = require('../../functions/embed');
const checkChannels = require("../../functions/Response based Checkers/checkChannels");
const mongo = require("../../mongo");
let botCache = require("../../caches/botCache");
const robloxAccountSchema = require("../../schemas/roblox-account-schema");


const idleMessage = "Command cancelled due to the user being idle";
const type0Message = "(type `0` to cancel / type \"`no`\" for none)\n"; 
const cancerCultureMessage ="Command cancelled successfully";

module.exports = {
	name : 'verify',
	description : 'Links your roblox account to your discord account.',
	usage:'verify',
    worksInDMs: true, 
    cooldown: 5,
    category:"roblox",
	async execute(message, args, server) {


        const messageFilter = m => !m.author.bot && m.author.id === message.author.id;
        let  daServer;
        try {
            await mongo().then(async (mongoose) =>{
                try{
                    let data = await raiderTrackerSchema.findOne({_id:"69"});
                   daServer= botCache.raiderTrackerChannelCache = data;
        
                } finally{
                    console.log("FETCHED TRACKER CHANNELS");
                    mongoose.connection.close();
                }
            })
            
            
            if(!args.length){
                const embed = makeEmbed("Verify yourself!", `This is your current tracker channels:`, server,false,"To ping a role when a tracked person joins, simply create a role with the same name as \"pinged role\". Exmaple: @raider_pings");
                if(daServer.channels[message.guild.id]){
                    embed.addField("Raider tracker:", `<#${daServer.channels[message.guild.id]}>\nChange value: \`${server.prefix}${this.name} raiders\`\nPinged role: \`@raider_pings\``, true);
                }else{
                    embed.addField("Raider tracker:", `Empty\nChange value: \`${server.prefix}${this.name} raiders\`\nPinged role: \`"raider_pings"\``, true)
                }
                

                message.channel.send({embeds:[embed]});
                return false;

            }else{
               
                switch (args[0].toLowerCase()) {
                    case "raiders":
                        let embedo1 = makeEmbed("Raider tracker", `${type0Message}** Enter or ping your raider tracker channel.**`, server);
                        message.channel.send({embeds:[embedo1]})
                            .then(m => {
                                message.channel.awaitMessages({filter:messageFilter, max: 1, time : 1000 * 30, errors: ['time']})
                                    .then(async a => {   
                                        let toCheck =   checkChannels(a);
                                        switch (toCheck) {
                                            case "not valid":
                                            case "no args": 
                                            case "not useable":              
                                                    message.channel.send("Invalid argument, command failed.");

                                                    return false;
                                                    break;
                                                case "cancel":
                                                    message.channel.send(cancerCultureMessage);

                                                    return false;
                                                    break;
                                                case "no":
                                                    daServer.channels[message.guild.id] = "";
                                                    break;
                                                default:
                                                    daServer.channels[message.guild.id] = toCheck;
                                                    break;
                                        }
                                        await mongo().then(async (mongoose) =>{
                                            try{ 
                                                await raiderTrackerSchema.findOneAndUpdate({_id:"69"},{
                                                    channels: daServer.channels,
                                                },{upsert:false});
                                                message.channel.send(`**Raider tracker  channel has been successfully updated ✅.**`)
                                                botCache.raiderTrackerChannelCache = daServer;
                                            } finally{
                                                console.log("WROTE TO DATABASE");
                                                mongoose.connection.close();
                                            }
                                        });
                                    }).catch(e => {
                                        console.log(e)
                                        message.channel.send(idleMessage);
                                    });
                            });

                            return true;
                        break; 
                        
                        
                    default:
                        message.channel.send("Invalid value.");
                        return false;
                }
            }
        } catch (err) {
            console.log(err);
        }

}

};*/