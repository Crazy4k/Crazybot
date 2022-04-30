const makeEmbed = require('../../functions/embed');
const checkChannels = require("../../functions/Response based Checkers/checkChannels");
const mongo = require("../../mongo");
let botCache = require("../../caches/botCache");
const raiderTrackerSchema = require("../../schemas/raiderTracker-schema");
const raiderGroupsJSON = require("../../[TSU]_Raider_Tracker/raiderGroups.json");
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
	isSlashCommand  : true,
    options			: [
        {
            name : "type",
            description : "The tracker type to modify",
            required : false,
            choices: [ {name:"AoS/KoS raiders tracker",value:"raider"}, {name:"AoS/KoS raids detector",value:"raider"}, ],
            type: 3,
		}
        

	],
});

    
trackers.execute = async function(message, args, server, isSlash) {

    let author;
    let type = args[0]
    let action = args[1];
    if(isSlash){
        author = message.user;
        if(args[0])type = args[0].value;
        if(args[1])action = args[1].value;
        else action = "none"
    }else author = message.author;


    const messageFilter = m => !m.author.bot && m.author.id === author.id;
    let  raiderCache;
    let raidsCache;
    try {
        await mongo().then(async (mongoose) =>{
            try{
                let data = await raiderTrackerSchema.findOne({_id:"raiders"});
                raiderCache = botCache.raiderTrackerChannelCache.raiders = data;
    
            } finally{
                console.log("FETCHED TRACKER CHANNELS");
                mongoose.connection.close();
            }
        });
        await mongo().then(async (mongoose) =>{
            try{
                let data = await raiderTrackerSchema.findOne({_id:"raids"});
                raidsCache = botCache.raiderTrackerChannelCache.raids = data;
    
            } finally{
                console.log("FETCHED TRACKER CHANNELS");
                mongoose.connection.close();
            }
        });


        
        if(!args.length){
            const embed = makeEmbed("Roblox trackers 📡", `This is your current tracker channels:`, server,false,"To ping a role when a tracked person joins, simply create a role with the same name as \"pinged role\". Exmaple: @raider_pings");
            if(raiderCache.channels[message.guild.id]){
                embed.addField("**Raider tracker:**", `**Tracker channel:**    <#${raiderCache.channels[message.guild.id]}>\n**Change value:**   \`${server.prefix}${this.name} raiders\`\n**Pinged role:** \`@raider_pings\``, true);
            }else{
                embed.addField("**Raider tracker:**", `**Tracker channel:**    \`No channel\`\n**Change value:**    \`${server.prefix}${this.name} raiders\`\n**Pinged role:** \`@raider_pings\``, true)
            }
            if(raidsCache.channels[message.guild.id]){
                embed.addField("**Big raids detector:**", `**Tracker channel:**    <#${raidsCache.channels[message.guild.id]}>\n**Change value:**   \`${server.prefix}${this.name} raids\`\n**Pinged role:** \`@raider_pings\``, true);
            }else{
                embed.addField("**Big raids detector:**", `**Tracker channel:**    \`No channel\`\n**Change value:**    \`${server.prefix}${this.name} raids\`\n**Pinged role:** \`@raider_pings\``, true)
            }
                      
            message.reply({embeds:[embed]});
            return false;

        }else{
            
            switch (type.toLowerCase()) {
                case "raiders":
                case "raider":
                    let embedo2 = makeEmbed("Raider tracker", `${type0Message}** Enter or ping your raider tracker channel.**`, server);
                    message.reply({embeds:[embedo2]})
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
                                                raiderCache.channels[message.guild.id] = "";
                                                break;
                                            default:
                                                raiderCache.channels[message.guild.id] = toCheck;
                                                break;
                                    }
                                    await mongo().then(async (mongoose) =>{
                                        try{ 
                                            await raiderTrackerSchema.findOneAndUpdate({_id:"raiders"},{
                                                channels: raiderCache.channels,
                                            },{upsert:false});
                                            message.channel.send(`**Raider tracker channel has been successfully updated ✅.**`)
                                            botCache.raiderTrackerChannelCache.raiders = raiderCache;
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
                case"raids":
                case"big raids":


                let embedo1 = makeEmbed("Big raids detector", `${type0Message}** Enter or ping your raids notification channel.**`, server);
                message.reply({embeds:[embedo1]})
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
                                            raidsCache.channels[message.guild.id] = "";
                                            break;
                                        default:
                                            raidsCache.channels[message.guild.id] = toCheck;
                                            break;
                                }
                                await mongo().then(async (mongoose) =>{
                                    try{ 
                                        await raiderTrackerSchema.findOneAndUpdate({_id:"raids"},{
                                            channels: raidsCache.channels,
                                        },{upsert:false});
                                        message.channel.send(`**Raids detection channel has been successfully updated ✅.**`)
                                        botCache.raiderTrackerChannelCache.raids = raidsCache;
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