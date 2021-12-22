const makeEmbed = require('../../functions/embed');
const checkChannels = require("../../functions/Response based Checkers/checkChannels");
const mongo = require("../../mongo");
let botCache = require("../../caches/botCache");
const raiderTrackerSchema = require("../../schemas/raiderTracker-schema");
const raiderGroupsJSON = require("../../raiderTracker/raiderGroups.json");
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
            autoComplete: true,
            choices: [ {name:"TSU AoS/KoS raiders tracker",value:"raider"},  ],
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
    let customRaidersCache;
    try {
        await mongo().then(async (mongoose) =>{
            try{
                let data = await raiderTrackerSchema.findOne({_id:"69"});
                raiderCache = botCache.raiderTrackerChannelCache.raiders = data;
    
            } finally{
                console.log("FETCHED TRACKER CHANNELS");
                mongoose.connection.close();
            }
        });

       /* await mongo().then(async (mongoose) =>{
            try{
                let data = await raiderTrackerSchema.findOne({_id:"420"});
                customRaidersCache = botCache.raiderTrackerChannelCache.custom = data;
    
            } finally{
                console.log("FETCHED TRACKER CHANNELS");
                mongoose.connection.close();
            }
        });
        if(!customRaidersCache.channels[message.guild.id]){
            customRaidersCache.channels[message.guild.id] = {channelID : "",trackedGroups : []};
            await mongo().then(async (mongoose) =>{
                try{
                    await raiderTrackerSchema.findOneAndUpdate({_id:"420"},{
                        channels: customRaidersCache.channels,
                    },{upsert:false});
        
                } finally{
                    console.log("UPDATED RAIDER TRACKER CHANNELS");
                    mongoose.connection.close();
                }
            });

        }*/
        
        if(!args.length){
            const embed = makeEmbed("Roblox trackers 📡", `This is your current tracker channels:`, server,false,"To ping a role when a tracked person joins, simply create a role with the same name as \"pinged role\". Exmaple: @raider_pings");
            if(raiderCache.channels[message.guild.id]){
                embed.addField("**Raider tracker:**", `**Tracker channel:**    <#${raiderCache.channels[message.guild.id]}>\n**Change value:**   \`${server.prefix}${this.name} raiders\`\n**Pinged role:** \`@raider_pings\``, true);
            }else{
                embed.addField("**Raider tracker:**", `**Tracker channel:**    \`No channel\`\n**Change value:**    \`${server.prefix}${this.name} raiders\`\n**Pinged role:** \`@raider_pings\``, true)
            }
            /*if(customRaidersCache.channels[message.guild.id].channelID){
                embed.addField("**Custom Raider tracker:**", `**Custom Tracker channel:**    <#${customRaidersCache.channels[message.guild.id].channelID}>\n**Change value:**   \`${server.prefix}${this.name} custom\`\n**Change groups**:\`${server.prefix}${this.name} groups\`\n**Pinged role:** \`@c_raider_pings\``, true);
            }else{
                embed.addField("**Custom Raider tracker:**", `**Custom Tracker channel:**    \`No channel\`\n**Change value:**    \`${server.prefix}${this.name} custom\`\n**Change groups**:\`${server.prefix}${this.name} groups\`\n**Pinged role:** \`@c_raider_pings\``, true)
            }*/
            

            message.reply({embeds:[embed]});
            return false;

        }else{
            
            switch (type.toLowerCase()) {
                case "raiders":
                case "raider":
                    let embedo1 = makeEmbed("Raider tracker", `${type0Message}** Enter or ping your raider tracker channel.**`, server);
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
                                                raiderCache.channels[message.guild.id] = "";
                                                break;
                                            default:
                                                raiderCache.channels[message.guild.id] = toCheck;
                                                break;
                                    }
                                    await mongo().then(async (mongoose) =>{
                                        try{ 
                                            await raiderTrackerSchema.findOneAndUpdate({_id:"69"},{
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

               /* case "customr":
                case "custom_raiders":
                case "custom":

                    let embedo2 = makeEmbed("Custom Raider tracker", `${type0Message}** Enter or ping your custom raider tracker channel.**`, server);
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
                                                if(!customRaidersCache.channels[message.guild.id]) customRaidersCache.channels[message.guild.id] = {channelID: undefined,trackedGroups : []};
                                                customRaidersCache.channels[message.guild.id].channelID = "";
                                                break;
                                            default:
                                                if(!customRaidersCache.channels[message.guild.id]) customRaidersCache.channels[message.guild.id] = {channelID: undefined,trackedGroups : []};
                                                customRaidersCache.channels[message.guild.id].channelID = toCheck;
                                                break;
                                    }
                                    await mongo().then(async (mongoose) =>{
                                        try{ 
                                            await raiderTrackerSchema.findOneAndUpdate({_id:"420"},{
                                                channels: customRaidersCache.channels,
                                            },{upsert:false});
                                            message.channel.send(`**Raider tracker channel has been successfully updated ✅.**`)
                                            botCache.raiderTrackerChannelCache.custom = customRaidersCache;
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


                    break;
                
                case "groups":
                case "group":
                    let embedo3 = makeEmbed("Tracked groups ", `These are the selected groups that are being tracked. \n \`Enter the group id or name to add/remove it from your list./Enter 0 or nothing if you wish to cancel\`\n**Beware that if you select more than more group, it will cause duplicate pings.**`, server);
                    for(let group of raiderGroupsJSON){
                        if(!customRaidersCache.channels[message.guild.id]) customRaidersCache.channels[message.guild.id] = {channelID: undefined,trackedGroups : []};
                        let added = customRaidersCache.channels[message.guild.id].trackedGroups.includes(`${group.id}`);
                        if(added) added = "✅";else added = "❌";
                        embedo3.addField(group.name,`Id: ${group.id}\nStatus: ${group.status}\nAdded: ${added}`,true);
                    }
                    message.reply({embeds:[embedo3]})
                        .then(m => {
                            message.channel.awaitMessages({filter:messageFilter, max: 1, time : 1000 * 30, errors: ['time']})
                                .then(async a => {   
                                    let arg  = a.first().content;
                                    let groupIdToChange;
                                    if(arg === "0"){
                                        message.channel.send(cancerCultureMessage);
                                        return;
                                    }
                                    for(let group of raiderGroupsJSON){
                                        if(arg === group.name || arg === `${group.id}`){
                                            groupIdToChange = group.id;
                                            break;
                                        }
                                    }
                                    if(!groupIdToChange){
                                        message.channel.send("Invalid value.");
                                        return;
                                    }else {
                                       if(customRaidersCache.channels[message.guild.id].trackedGroups.includes(`${groupIdToChange}`)){
                                        customRaidersCache.channels[message.guild.id].trackedGroups.splice(customRaidersCache.channels[message.guild.id].trackedGroups.indexOf(`${groupIdToChange}`),1);
                                       } else{
                                        customRaidersCache.channels[message.guild.id].trackedGroups.push(`${groupIdToChange}`);
                                       }
                                    }
                                    
                                   
                                    await mongo().then(async (mongoose) =>{
                                        try{ 
                                            await raiderTrackerSchema.findOneAndUpdate({_id:"420"},{
                                                channels: customRaidersCache.channels,
                                            },{upsert:false});
                                            message.channel.send(`**Custom groups list has been successfully updated ✅.**`)
                                            botCache.raiderTrackerChannelCache.custom = customRaidersCache;
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
                    break;*/
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