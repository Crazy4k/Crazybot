const makeEmbed = require('../../functions/embed');
const checkChannels = require("../../functions/Response based Checkers/checkChannels");
const mongo = require("../../mongo");
let guildsCache = require("../../caches/guildsCache");
const serversSchema = require("../../schemas/servers-schema");

const type0Message = "(type `0` to cancel / type \"`no`\" for none)\n"; 
const idleMessage = "Command cancelled due to the user being idle";
const invalidargMessage = "Invalid argument, command failed.";
const cancerCultureMessage ="Command cancelled successfully";

module.exports = {
	name : 'logs',
	description : 'modifies the logs of the server',
	usage:'logs',
    cooldown: 60 * 5,
	whiteList:'ADMINISTRATOR',
    category:"Server configurations",
	execute(message, args, server) {
        let embed = makeEmbed("Server Settings", `${type0Message}**Enter your members logging channel. 👤**`, server);
        const messageFilter = m => !m.author.bot && m.author.id === message.author.id;

            try {

                let  daServer = server;
                if(!daServer.logs.isSet && !args.length){
                    message.channel.send(embed)
                        .then(m => {
                            message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                .then(a => {    
                                    switch (checkChannels(a)) {
                                        case "not valid":
                                        case "no args": 
                                        case "not useable":              
                                             
                                            message.channel.send(invalidargMessage);
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
                                            daServer.logs.hiByeLog = checkChannels(a);
                                            break;
                                        }
                                    embed.setDescription(`${type0Message} **Enter your messages logging channel. 📫**`);
                                    m.edit(embed);
                                    message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                        .then(a => {   
                                            switch (checkChannels(a)) {
                                                case "not valid":
                                                case "no args": 
                                                case "not useable":              
                                                    message.channel.send(invalidargMessage);
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
                                                    daServer.logs.deleteLog = checkChannels(a);
                                                    break;
                                            }
                                                    
                                            embed.setDescription(`${type0Message} **Enter your server logging channel. 🏠**`);
                                            m.edit(embed);
                                            message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                .then(a => {  
                                                    
                                                    switch (checkChannels(a)) {
                                                        case "not valid":
                                                        case "no args": 
                                                        case "not useable":              
                                                            message.channel.send(invalidargMessage);
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
                                                            daServer.logs.serverLog = checkChannels(a);
                                                            break;
                                                    }                                
                                                    embed.setDescription(`${type0Message} **Enter your warnings logging channel. 🔨**`);
                                                    m.edit(embed);
                                                    message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                        .then(async (a) => {    
                                                            switch (checkChannels(a)) {
                                                                case "not valid":
                                                                case "no args": 
                                                                case "not useable":              
                                                                    message.channel.send(invalidargMessage);
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
                                                                    daServer.logs.warningLog = checkChannels(a);
                                                                    break;
                                                            }
                                        
                                                            daServer.logs.isSet = true;

                                                            await mongo().then(async (mongoose) =>{
                                                                try{ 
                                                                    await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                                       
                                                                        logs:{hiByeLog:daServer.logs.hiByeLog,
                                                                            deleteLog:daServer.logs.deleteLog,
                                                                            serverLog:daServer.logs.serverLog,
                                                                            warningLog:daServer.logs.warningLog,
                                                                            isSet:daServer.logs.isSet,
                                                                        },
                                                                    },{upsert:false});
                                                                    guildsCache[message.guild.id].logs ={hiByeLog:daServer.logs.hiByeLog,
                                                                        deleteLog:daServer.logs.deleteLog,
                                                                        serverLog:daServer.logs.serverLog,
                                                                        warningLog:daServer.logs.warningLog,
                                                                        isSet:daServer.logs.isSet
                                                                    };
                                                                } finally{
                                                                    console.log("WROTE TO DATABASE");
                                                                    mongoose.connection.close();
                                                                }
                                                            });
                                                                    		
                                                                        
                                                
                                                            let embed2 = makeEmbed("Done! your server's logging channels have been set ✅",`Your server logs looks like this:\n `, server);
                                                            if(daServer.logs.hiByeLog){
                                                                embed2.addField("Member logs :bust_in_silhouette:", `<#${daServer.logs.hiByeLog}>`, true);
                                                            }else{
                                                                embed2.addField("Member logs :bust_in_silhouette:" , `Empty`, true)
                                                            }
                                                            if(daServer.logs.deleteLog){
                                                                embed2.addField("Messages logs :mailbox_with_mail:", `<#${daServer.logs.deleteLog}>`, true);
                                                            }else{
                                                                embed2.addField("Messages logs :mailbox_with_mail:", `Empty`, true)
                                                            }
                                                            if(daServer.logs.deleteLog){
                                                                embed2.addField("Server logs :house:", `<#${daServer.logs.serverLog}>`, true);
                                                            }else{
                                                                embed2.addField("Server logs :house:", `Empty`, true)
                                                            }
                                                            if(daServer.logs.deleteLog){
                                                                embed2.addField("Warn logs :hammer:", `<#${daServer.logs.warningLog}>`, true);
                                                            }else{
                                                                embed2.addField("Warn logs :hammer:", `Empty`, true)
                                                            }
                                                            message.channel.send(embed2);
                                                            return true;
                                                                        
                                                                    
                                                            }).catch(e => {message.channel.send(idleMessage);console.log(e);});
                                                    }).catch(e => {message.channel.send(idleMessage);console.log(e);});
                                            }).catch(e => {message.channel.send(idleMessage);console.log(e);});
                                        })
                                    }).catch(e => {message.channel.send(idleMessage);console.log(e);});
                        } else if(!args.length){
                            const embed = makeEmbed("Server settings", `Your server logging channels are this:\nType "${server.prefix}logs \`value\`" to edit a selected option.\nExample:${server.prefix}logs memberLog`, server);
                            if(daServer.logs.hiByeLog){
                                embed.addField("Member logs 👤", `<#${daServer.logs.hiByeLog}>\nvalue: \`memberLog\``, true);
                            }else{
                                embed.addField("Member logs 👤", `Empty\nvalue: \`memberLog\``, true)
                            }
                            if(daServer.logs.deleteLog){
                                embed.addField("Messages logs 📫", `<#${daServer.logs.deleteLog}>\nvalue: \`messageLog\``, true);
                            }else{
                                embed.addField("Messages logs 📫", `Empty\nvalue: \`messageLog\``, true)
                            }
                            if(daServer.logs.deleteLog){
                                embed.addField("Server logs 🏠", `<#${daServer.logs.serverLog}>\nvalue: \`serverLog\``, true);
                            }else{
                                embed.addField("Server logs 🏠", `Empty\nvalue: \`serverLog\``, true)
                            }
                            if(daServer.logs.deleteLog){
                                embed.addField("Warn logs 🔨", `<#${daServer.logs.warningLog}>\nvalue: \`warningLog\``, true);
                            }else{
                                embed.addField("Warn logs🔨", `Empty\nvalue: \`warningLog\``, true)
                            }
                            
                            message.channel.send(embed);
                        }else{
                            let daServer = server;
                            switch (args[0].toLowerCase()) {
                                case "memberlog":
                                    let embedo1 = makeEmbed("Logs manager", `${type0Message}**Enter your members logging channel. 👤**`, server);
                                    message.channel.send(embedo1)
                                        .then(m => {
                                            message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
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
                                                            message.channel.send(`Channel set✅\n**Members logging channel has been successfully updated.**`)
                                                            guildsCache[message.guild.id] = daServer;
                                                        } finally{
                                                            console.log("WROTE TO DATABASE");
                                                            mongoose.connection.close();
                                                        }
                                                    });
                                                });
                                        });
                                    break;
                                    case "messagelog":
                                        let embedo2 = makeEmbed("Logs manager", `${type0Message}**Enter your messages logging channel. 📫**`, server);
                                        message.channel.send(embedo2)
                                            .then(m => {
                                                message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
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
                                                                message.channel.send(`Channel set✅\n**Messages logging channel has been successfully updated.**`)
                                                                guildsCache[message.guild.id] = daServer;
                                                            } finally{
                                                                console.log("WROTE TO DATABASE");
                                                                mongoose.connection.close();
                                                            }
                                                        });
                                                    });
                                            });
                                        break;
                                        case "serverlog":
                                            let embedo3 = makeEmbed("Logs manager", `${type0Message}**Enter your Server logging channel. 🏠**`, server);
                                            message.channel.send(embedo3)
                                                .then(m => {
                                                    message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
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
                                                                    message.channel.send(`Channel set✅\n**Server logging channel has been successfully updated.**`)
                                                                    guildsCache[message.guild.id] = daServer;
                                                                } finally{
                                                                    console.log("WROTE TO DATABASE");
                                                                    mongoose.connection.close();
                                                                }
                                                            });
                                                        });
                                                });
                                            break;
                                            case "warninglog":
                                                let embedo4 = makeEmbed("Logs manager", `${type0Message}**Enter your Warns logging channel. 🔨**`, server);
                                                message.channel.send(embedo4)
                                                    .then(m => {
                                                        message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
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
                                                                        message.channel.send(`Channel set✅\n**Warns logging channel has been successfully updated.**`)
                                                                        guildsCache[message.guild.id] = daServer;
                                                                    } finally{
                                                                        console.log("WROTE TO DATABASE");
                                                                        mongoose.connection.close();
                                                                    }
                                                                });
                                                            });
                                                    });
                                                break;
                                default:
                                    message.channel.send("Invalid value.");
                                    break;
                            }
                        }
                    } catch (err) {console.log(err);}

	}

};