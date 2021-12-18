const makeEmbed = require('../../functions/embed');
const checkChannels = require("../../functions/Response based Checkers/checkChannels");
const mongo = require("../../mongo");
let {guildsCache} = require("../../caches/botCache");
const serversSchema = require("../../schemas/servers-schema");


const idleMessage = "Command cancelled due to the user being idle";
const type0Message = "(type `0` to cancel / type \"`no`\" for none)\n"; 
const cancerCultureMessage ="Command cancelled successfully";
const Command = require("../../Classes/Command");

let logs = new Command("logs");

logs.set({
	aliases         : [],
	description     : "Modifies the logs of the server",
	usage           : "logs",
	cooldown        : 15,
	unique          : true,
	category        : "config",
	whiteList       : "ADMINISTRATOR",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    options			: [
        {
            name : "log-type",
            description : "Which of the following logging channel do you want to modify",
            choices: [
                {name: "Member logs", value: "memberLog"},
                {name: "Message logs", value: "messageLog"},
                {name: "Server logs", value: "serverLog"},
                {name: "Moderation commands logs", value: "modLog"},
                {name: "Points commands logs", value: "pointslog"},
                {name: "Events commands logs", value: "eventlog"},
            ],
            required : false,
            type: 3,
		},
		

	],
});


logs.execute = async function (message, args, server, isSlash) {


    
    let author;
    let type = args[0];
    if(isSlash){
        author = message.user;
        if(args[0])type = args[0].value;
        
    }
    else author = message.author;





    const messageFilter = m => !m.author.bot && m.author.id === author.id;

    try {

        let  daServer = server;
        
        if(!args.length){
            const embed = makeEmbed("Server settings", `Your server logging channels are this:`, server);
            if(daServer.logs.hiByeLog){
                embed.addField("Member logs 👤", `<#${daServer.logs.hiByeLog}>\n\`${server.prefix}${this.name} memberLog\``, true);
            }else{
                embed.addField("Member logs 👤", `Empty\n\`${server.prefix}${this.name} memberLog\``, true)
            }
            if(daServer.logs.deleteLog){
                embed.addField("Messages logs 📫", `<#${daServer.logs.deleteLog}>\n\`${server.prefix}${this.name} messageLog\``, true);
            }else{
                embed.addField("Messages logs 📫", `Empty\n\`${server.prefix}${this.name} messageLog\``, true)
            }
            if(daServer.logs.serverLog){
                embed.addField("Server logs 🏠", `<#${daServer.logs.serverLog}>\n\`${server.prefix}${this.name} serverLog\``, true);
            }else{
                embed.addField("Server logs 🏠", `Empty\n\`${server.prefix}${this.name} serverLog\``, true)
            }
            if(daServer.logs.warningLog){
                embed.addField("Moderation logs 🔨", `<#${daServer.logs.warningLog}>\n\`${server.prefix}${this.name} modLog\``, true);
            }else{
                embed.addField("Moderation logs 🔨", `Empty\n\`${server.prefix}${this.name} modlog\``, true)
            }
            if(daServer.logs.pointsLog){
                embed.addField("Points logs 📈", `<#${daServer.logs.pointsLog}>\n\`${server.prefix}${this.name} pointslog\``, true);
            }else{
                embed.addField("Points logs 📈", `Empty\n\`${server.prefix}${this.name} pointslog\``, true)
            }
            if(daServer.logs.eventsLog){
                embed.addField("Events logs 📢", `<#${daServer.logs.eventsLog}>\n\`${server.prefix}${this.name} eventlog\``, true);
            }else{
                embed.addField("Events logs 📢", `Empty\n\`${server.prefix}${this.name} eventlog\``, true)
            }

            message.reply({embeds:[embed]});
            return false;

        }else{
            
            let daServer = server;
            switch (type.toLowerCase()) {
                case "memberlogs":
                case "memberlog":
                case "member":
                case "members":
                    let embedo1 = makeEmbed("Logs manager", `${type0Message}**Enter your members logging channel. 👤**`, server);
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
                                                daServer.logs.hiByeLog = "";
                                                break;
                                            default:
                                                daServer.logs.hiByeLog = toCheck;
                                                break;
                                    }
                                    await mongo().then(async (mongoose) =>{
                                        try{ 
                                            await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                logs: daServer.logs,
                                            },{upsert:false});
                                            message.channel.send(`**Members logging channel has been successfully updated ✅.**`)
                                            guildsCache[message.guild.id] = daServer;
                                        } finally{
                                            console.log("WROTE TO DATABASE");
                                            mongoose.connection.close();
                                        }
                                    });
                                }).catch(e => {

                                    message.channel.send(idleMessage);
                                });
                        });

                        return true;
                    break;
                    case "messagelogs":
                    case "messagelog":
                    case "message":
                    case "messages":
                        let embedo2 = makeEmbed("Logs manager", `${type0Message}**Enter your messages logging channel. 📫**`, server);
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
                                                daServer.logs.deleteLog = "";
                                                break;
                                            default:
                                                daServer.logs.deleteLog = toCheck;
                                                break;
                                        }
                                        await mongo().then(async (mongoose) =>{
                                            try{ 
                                                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                    logs: daServer.logs,
                                                },{upsert:false});
                                                message.channel.send(`**Messages logging channel has been successfully updated ✅.**`)
                                                guildsCache[message.guild.id] = daServer;
                                            } finally{
                                                console.log("WROTE TO DATABASE");
                                                mongoose.connection.close();
                                            }
                                        });
                                    }).catch(e => {
                                        message.channel.send(idleMessage);
                                    });
                            });
                            return true;
                        break;
                        case "serverlogs":
                        case "serverlog":
                        case "server":
                    
                            let embedo3 = makeEmbed("Logs manager", `${type0Message}**Enter your Server logging channel. 🏠**`, server);
                            message.reply({embeds:[embedo3]})
                                .then(m => {
                                    message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
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
                                                    daServer.logs.serverLog = "";
                                                    break;
                                                default:
                                                    daServer.logs.serverLog = toCheck;
                                                    break;
                                            }
                                            await mongo().then(async (mongoose) =>{
                                                try{ 
                                                    await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                        logs: daServer.logs,
                                                    },{upsert:false});
                                                    message.channel.send(`**Server logging channel has been successfully updated ✅.**`)
                                                    guildsCache[message.guild.id] = daServer;
                                                } finally{
                                                    console.log("WROTE TO DATABASE");
                                                    mongoose.connection.close();
                                                }
                                            });
                                        }).catch(e => {

                                            message.channel.send(idleMessage);
                                        });
                                });

                                return true;
                            break;
                            case "modlogs":
                            case "modlog":
                            case "mod":
                            case "moderation":
                                let embedo4 = makeEmbed("Logs manager", `${type0Message}**Enter your moderation logging channel. 🔨**`, server);
                                message.reply({embeds:[embedo4]})
                                    .then(m => {
                                        message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
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
                                                        daServer.logs.warningLog = "";
                                                        break;
                                                    default:
                                                        daServer.logs.warningLog = toCheck;
                                                        break;
                                                }
                                                await mongo().then(async (mongoose) =>{
                                                    try{ 
                                                        await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                            logs: daServer.logs,
                                                        },{upsert:false});
                                                        message.channel.send(`**Moderation logging channel has been successfully updated ✅.**`)
                                                        guildsCache[message.guild.id] = daServer;
                                                    } finally{
                                                        console.log("WROTE TO DATABASE");
                                                        mongoose.connection.close();
                                                    }
                                                });
                                            }).catch(e => {
                                                message.channel.send(idleMessage);
                                            });
                                    });
                                    return true;
                                break;
                                case "pointslogs":
                                case "pointslog":
                                case "points":
                                case "point":
                    let embedo5 = makeEmbed("Logs manager", `${type0Message}**Enter your points logging channel. 📈**`, server);
                    message.reply({embeds:[embedo5]})
                        .then(m => {
                            message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
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
                                            daServer.logs.pointsLog = "";
                                            break;
                                        default:
                                            daServer.logs.pointsLog = toCheck;
                                            break;
                                    }
                                    await mongo().then(async (mongoose) =>{
                                        try{ 
                                            await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                logs: daServer.logs,
                                            },{upsert:false});
                                            message.channel.send(`**Points logging channel has been successfully updated ✅.**`)
                                            guildsCache[message.guild.id] = daServer;
                                        } finally{
                                            console.log("WROTE TO DATABASE");
                                            mongoose.connection.close();
                                        }
                                    });
                                }).catch(e => {
                                    message.channel.send(idleMessage);
                                });
                        });
                        return true;
                    break;
                    case "eventlogs":
                    case "eventlog":
                    case "events":
                    case "event":
                    let embedo6 = makeEmbed("Logs manager", `${type0Message}**Enter your events logging channel. 📢**`, server);
                    message.reply({embeds:[embedo6]})
                        .then(m => {
                            message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
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
                                            daServer.logs.eventsLog = "";
                                            break;
                                        default:
                                            daServer.logs.eventsLog = toCheck;
                                            break;
                                    }
                                    await mongo().then(async (mongoose) =>{
                                        try{ 
                                            await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                logs: daServer.logs,
                                            },{upsert:false});
                                            message.channel.send(`**Events logging channel has been successfully updated ✅.**`)
                                            guildsCache[message.guild.id] = daServer;
                                        } finally{
                                            console.log("WROTE TO DATABASE");
                                            mongoose.connection.close();
                                            
                                        }
                                    });
                                }).catch(e => {
                                    message.channel.send(idleMessage);
                                    return false;
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

module.exports = logs;