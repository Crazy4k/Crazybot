const makeEmbed = require('../../functions/embed');
const checkChannels = require("../../functions/Response based Checkers/checkChannels");
const mongo = require("../../mongo");
let botCache = require("../../caches/botCache");
const raiderTrackerSchema = require("../../schemas/raiderTracker-schema");
const Command = require("../../Classes/Command");

const idleMessage = "Command cancelled due to the user being idle";
const type0Message = "(type `0` to cancel / type \"`no`\" for none or to remove it)\n"; 
const cancerCultureMessage ="Command cancelled successfully";
let trackers = new Command("trackers");

trackers.set({
	aliases         : ["tracker"],
	description     : "Shows you the current available TSU related trackers that you can add to your server.",
	usage           : "trackers",
	cooldown        : 5,
	unique          : true,
	category        : "roblox",
	whiteList       : "ADMINISTRATOR",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : false
});

    
trackers.execute = async function(message, args, server) {
    console.log(`USED ;TRACKERS IN ${message.guild.id} by ${message.author.id}`)
    const messageFilter = m => !m.author.bot && m.author.id === message.author.id;
    let  daServer;
    try {
        await mongo().then(async (mongoose) =>{
            try{
                let data = await raiderTrackerSchema.findOne({_id:"69"});
                daServer= botCache.raiderTrackerChannelCache.raiders = data;
    
            } finally{
                console.log("FETCHED TRACKER CHANNELS");
                mongoose.connection.close();
            }
        })

        
        if(!args.length){
            const embed = makeEmbed("Roblox trackers", `This is your current tracker channels:`, server,false,"To ping a role when a tracked person joins, simply create a role with the same name as \"pinged role\". Exmaple: @raider_pings");
            if(daServer.channels[message.guild.id]){
                embed.addField("Raider tracker:", `**Tracker channel:**    <#${daServer.channels[message.guild.id]}>\n**Change value:**   \`${server.prefix}${this.name} raiders\`\n**Pinged role:** \`@raider_pings\``, true);
            }else{
                embed.addField("Raider tracker:", `**Tracker channel:**    \`No channel\`\n**Change value:**    \`${server.prefix}${this.name} raiders\`\n**Pinged role:** \`@raider_pings\``, true)
            }
            

            message.channel.send({embeds:[embed]});
            return false;

        }else{
            
            switch (args[0].toLowerCase()) {
                case "raiders":
                case "raider":
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
                                            message.channel.send(`**Raider tracker channel has been successfully updated ✅.**`)
                                            botCache.raiderTrackerChannelCache.raiders = daServer;
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

module.exports = trackers;