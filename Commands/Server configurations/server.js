const makeEmbed = require('../../functions/embed');
const type0Message = "(type `0` to cancel / type \"`no`\" for none)\n"; 
const idleMessage = "Command cancelled due to the user being idle";
const cancerCultureMessage = "Command cancelled successfully";
const checkChannels = require("../../functions/Response based Checkers/checkChannels");
const checkRoles = require("../../functions/Response based Checkers/checkRoles");
const mongo = require("../../mongo");
let guildsCache = require("../../caches/guildsCache");
const serversSchema = require("../../schemas/servers-schema");

module.exports = {
	name : 'server',
	description : 'modifies the settings of the server',
	usage:'server',
    cooldown:  30 ,
    whiteList:'ADMINISTRATOR',
    unique: true,
    category:"Server configurations",
	execute(message, args, server) {
        
        const messageFilter = m => !m.author.bot && m.author.id === message.author.id;
        const reactionFilter = (react, noob) => noob.id === message.author.id && !noob.bot;
		
        try {        
            let daServer = server;
            if(!args.length){
                const embed = makeEmbed("Server configurations", `Your server configuration look like this:`, server);
                if(server.hiByeChannel){
                    embed.addField('Welcome channel :wave:', `<#${server.hiByeChannel}>\n\`${server.prefix}${this.name} welcomeChannel\``, true);
                }else {
                    embed.addField('Welcome channel :wave:', `Empty\n\`${server.prefix}${this.name} welcomeChannel\``, true);
                }
                if(server.hiRole){
                    embed.addField('Welcome role :wave:', `<@&${server.hiRole}>\n\`${server.prefix}${this.name} welcomeRole\``, true);
                } else {
                    embed.addField('Welcome role :wave:',  `Empty\n\`${server.prefix}${this.name} welcomeRole\``,true);
                }
                if(daServer.muteRole){
                    embed.addField('Mute role :mute:', `<@&${daServer.muteRole}>\n \`${server.prefix}${this.name} muteRole\``, true);
                } else {
                    embed.addField('Mute role :mute:',  `Empty\n\`${server.prefix}${this.name} muteRole\``,true);
                }

                            
                embed.addFields(
                    {name:'Delete messages in logs? :x:', value:`${server.deleteMessagesInLogs}\n \`${server.prefix}${this.name} deleteInLogs\``, inline:true},
                    {name:'Delete failed commands?:clock1:', value:`${server.deleteFailedCommands}\n \`${server.prefix}${this.name} deleteFails\``, inline:true},
                    {name:'Language :abc:', value:`${server.language}`, inline:true},
                    {name:'Prefix :information_source:', value:`${server.prefix}`, inline:true},
                    {name:'Default embed color :white_large_square:', value:`${server.defaultEmbedColor}`, inline:true}
                );
                message.channel.send({embeds:[embed]});
                return false;

            } else {
                let daServer = server;
                switch (args[0].toLowerCase()) {
                    case "welcomechannel":
                        let embedo = makeEmbed("Server Settings", `${type0Message}**Enter  your welcoming channel.👋**`, server);
                        message.channel.send({embeds: [embedo]})
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
                                                daServer.hiByeChannel = "";
                                                break;
                                            default:
                                                daServer.hiByeChannel = toCheck;
                                                break;
                                        }
                                        await mongo().then(async (mongoose) =>{
                                            try{ 
                                                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                    hiByeChannel: daServer.hiByeChannel,
                                                },{upsert:false});
                                                message.channel.send(`**Welcome channel has been successfully updated.**`)
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
                    case "welcomerole":
                        let embedo1 = makeEmbed("Server Settings", `${type0Message}**Enter  your welcoming role.👋**`, server);
                        message.channel.send({embeds: [embedo1]})
                            .then(m => {
                                message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                    .then(async a => {     
                                        let toCheck = checkRoles(a);
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
                                                daServer.hiRole = "";
                                                break;
                                            default:
                                                daServer.hiRole = toCheck;
                                                break;
                                        }
                                        await mongo().then(async (mongoose) =>{
                                            try{ 
                                                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                    hiRole: daServer.hiRole,
                                                },{upsert:false});
                                                message.channel.send(`\n**Welcome role has been successfully updated.**`)
                                                guildsCache[message.guild.id] = daServer;
                                            } finally{
                                                console.log("WROTE TO DATABASE");
                                                mongoose.connection.close();
                                            }
                                        });
                                    }).catch(e => {
                                        message.channel.send(idleMessage);
                                    });;
                            });
                            return true;
                        break;
                    case "muterole":
                        let embedo2 = makeEmbed("Server Settings", `${type0Message}**Enter  your Mute role.🔇**`, server);
                        message.channel.send({ embeds: [embedo2]})
                            .then(m => {
                                message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                    .then(async a => {      
                                        let toCheck = checkRoles(a);
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
                                                daServer.muteRole = "";
                                                break;
                                            default:
                                                daServer.muteRole = toCheck;
                                                break;
                                        }
                                        await mongo().then(async (mongoose) =>{
                                            try{ 
                                                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                    muteRole: daServer.muteRole,
                                                },{upsert:false});
                                                message.channel.send(`**Mute role has been successfully updated.**`)
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
                    case "deleteinlogs":
                        let embedo6 = makeEmbed("Server Settings", `**Do you want messages to be deleted in logs?❌ \n[✅ is yes ❌ is no]**`, server);
                        message.channel.send({embeds: [embedo6]})
                        .then(async m => {
                            m.react("✅");
                            m.react("❌");
                            m.awaitReactions({filter: reactionFilter,  max : 1,time: 1000 * 30, errors : ["time"] })
                                .then(async a =>{
                                    
                                    switch (a.first().emoji.name) {
                                        case "✅":
                                            daServer.deleteMessagesInLogs = true;
                                            break;
                                        case "❌":
                                            daServer.deleteMessagesInLogs = false;
                                            break;
                                        default:
                                            message.channel.send(cancerCultureMessage);
                                            return false;
                                            break;
                                    }
                                    await mongo().then(async (mongoose) =>{
                                        try{ 
                                            await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                deleteMessagesInLogs: daServer.deleteMessagesInLogs,
                                            },{upsert:false});
                                            message.channel.send(`**Boolean status has been successfully updated.**`)
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
                    case "deletefails":
                        let embedo7 = makeEmbed("Server Settings", `**Do you want failed commands to be deleted after a few seconds?🕐\n[✅ is yes ❌ is no]**`, server);
                        message.channel.send({embeds:[embedo7]})
                        .then(async m => {
                            m.react("✅");
                            m.react("❌");
                            m.awaitReactions({filter: reactionFilter,  max : 1,time: 1000 * 30, errors : ["time"] })
                                .then(async a =>{
                                    
                                    switch (a.first().emoji.name) {
                                        case "✅":
                                            daServer.deleteFailedCommands = true;
                                            break;
                                        case "❌":
                                            daServer.deleteFailedCommands = false;
                                            break;
                                        default:
                                            message.channel.send(cancerCultureMessage);
                                            return false;
                                            break;
                                    }
                                    await mongo().then(async (mongoose) =>{
                                        try{ 
                                            await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                deleteFailedCommands: daServer.deleteFailedCommands,
                                            },{upsert:false});
                                            message.channel.send(`**Boolean status has been successfully updated.**`)
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
                    default:
                        message.channel.send("Invalid value.");
                        break;
                }
            }
        } catch (err) {console.log(err);}
 
	},

};