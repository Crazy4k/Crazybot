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
	usage:'!server',
    cooldown:  5,
    whiteList:'ADMINISTRATOR',
	async execute(message, args, server) {
        
        let embed = makeEmbed("Server Settings", `${type0Message}**Enter  your welcoming channel.👋**`, server);
        const messageFilter = m => !m.author.bot && m.author.id === message.author.id;
        const reactionFilter = (react, noob) => noob.id === message.author.id && !noob.bot;
		
        try {        
            let daServer = server;
            if(!daServer.isSet && !args.length){
                message.channel.send(embed)
                    .then(m => {
                        message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                            .then(a => {      
                                switch (checkChannels(a)) {
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
                                        daServer.hiByeChannel = checkChannels(a);
                                        break;
                                }
                                embed.setDescription(`${type0Message} **Enter your welcoming role.👋**`);
                                m.edit(embed);

                                message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                    .then(a => {
                                        switch (checkRoles(a)) {
                                            case "not valid":
                                            case "not useable":
                                            case "no args":               
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
                                                            
                                                 daServer.hiRole = checkRoles(a);
                                                break;
                                        }
                                        embed.setDescription(`${type0Message} **Enter your mute role.🔇**`);
                                        m.edit(embed);

                                            message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                .then(a => {
                                                    switch (checkRoles(a)) {
                                                        case "not valid":
                                                        case "not useable":
                                                        case "no args":               
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
                                                            
                                                            daServer.muteRole = checkRoles(a);
                                                            break;
                                                    }
                                                        embed.setDescription(`${type0Message} **Enter your first warning role.1️⃣**`);
                                                            m.edit(embed);
                                                            message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                                .then(a => {  
                                                                    switch (checkRoles(a)) {
                                                                        case "not valid":
                                                                        case "not useable":
                                                                        case "no args":               
                                                                            message.channel.send("Invalid argument, command failed.");
                                                                            return false;
                                                                            break;
                                                                        case "cancel":
                                                                            message.channel.send(cancerCultureMessage);
                                                                            return false;
                                                                            break;
                                                                        case "no":
                                                                            daServer.warningRoles.firstwarningRole = "";
                                                                            break;
                                                                        default:
                                                                            
                                                                            daServer.warningRoles.firstwarningRole = checkRoles(a);
                                                                            break;
                                                                    }  
                                                                        embed.setDescription(`${type0Message} **Enter your second warning role.2️⃣**`);
                                                                        m.edit(embed);
                                                                        message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                                            .then(a => {  
                                                                                
                                                                                switch (checkRoles(a)) {
                                                                                    case "not valid":
                                                                                    case "not useable":
                                                                                    case "no args":               
                                                                                        message.channel.send("Invalid argument, command failed.");
                                                                                        return false;
                                                                                        break;
                                                                                    case "cancel":
                                                                                        message.channel.send(cancerCultureMessage);
                                                                                        return false;
                                                                                        break;
                                                                                    case "no":
                                                                                        daServer.warningRoles.secondWarningRole = "";
                                                                                        break;
                                                                                    default:
                                                                                        
                                                                                        daServer.warningRoles.secondWarningRole = checkRoles(a);
                                                                                        break;
                                                                                } 
                                                                                
                                                                                embed.setDescription(`${type0Message} **Enter your third warning role.3️⃣**`);
                                                                                m.edit(embed);
            
                                                                                message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                                                    .then(a => {    

                                                                                        switch (checkRoles(a)) {
                                                                                            case "not valid":
                                                                                            case "not useable":
                                                                                            case "no args":               
                                                                                                message.channel.send("Invalid argument, command failed.");
                                                                                                return false;
                                                                                                break;
                                                                                            case "cancel":
                                                                                                message.channel.send(cancerCultureMessage);
                                                                                                return false;
                                                                                                break;
                                                                                            case "no":
                                                                                                daServer.warningRoles.thirdWarningRole = "";
                                                                                                break;
                                                                                            default:
                                                                                                
                                                                                                daServer.warningRoles.thirdWarningRole = checkRoles(a);
                                                                                                break;
                                                                                        } 
                                                                                    
                                                                                        embed.setDescription(`**Do you want messages to be deleted in logs? ❌\n[✅ is yes ❌ is no]**`);
                                                                                        m.edit(embed)
                                                                                            .then(m => {
                                                                                                m.react("✅");
                                                                                                m.react("❌");
                                                                                                m.awaitReactions(reactionFilter, { max : 1,time: 120000, errors : ["time"] })
                                                                                                    .then(a =>{
                                                                                                        
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
                                                                                                        m.reactions.removeAll();
                                                                                                        embed.setDescription(`**Do you want failed commands to be deleted after a few seconds?🕐\n[✅ is yes ❌ is no]**`);
                                                                                                        m.edit(embed)
                                                                                                            .then(m => {
                                                                                                                m.react("✅");
                                                                                                                m.react("❌");
                                                                                                                m.awaitReactions(reactionFilter, { max : 1,time: 120000, errors : ["time"] })
                                                                                                                    .then( async (a) =>{
                                                                                                                        
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


                                                                                                                        daServer.isSet = true;
                                                                                                                        await mongo().then(async (mongoose) =>{
                                                                                                                            try{ 
                                                                                                                                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                                                                                                    hiByeChannel: daServer.hiByeChannel,
                                                                                                                                    hiRole: daServer.hiRole,
                                                                                                                                    muteRole: daServer.muteRole,
                                                                                                                                    warningRoles: {
                                                                                                                                        firstwarningRole:daServer.warningRoles.firstwarningRole,
                                                                                                                                        secondWarningRole: daServer.warningRoles.secondWarningRole,
                                                                                                                                        thirdWarningRole: daServer.warningRoles.thirdWarningRole
                                                                                                                                    },
                                                                                                                                    deleteMessagesInLogs: daServer.deleteMessagesInLogs,
                                                                                                                                    deleteFailedCommands: daServer.deleteFailedCommands,
                                                                                                                                    isSet: daServer.isSet
                                                                                                                                    

                                                                                                                                },{upsert:false});
                                                                                                                                guildsCache[message.guild.id] = daServer;
                                                                                                                            } finally{
                                                                                                                                console.log("WROTE TO DATABASE");
                                                                                                                                mongoose.connection.close();
                                                                                                                            }
                                                                                                                        });
                                                                                                                        
                                                                                                                                const embed2 = makeEmbed("Server configurations", `Done ✅.Your server configuration look like:`, server);
                                                                                                                                if(daServer.hiByeChannel){
                                                                                                                                    embed2.addField('Welcome channel :wave:', `<#${daServer.hiByeChannel}>`, true);
                                                                                                                                }else {
                                                                                                                                    embed2.addField('Welcome channel :wave:', `Empty`, true);
                                                                                                                                }
                                                                                                                                if(daServer.hiRole){
                                                                                                                                    embed2.addField('Welcome role :wave:', `<@&${daServer.hiRole}>`, true);
                                                                                                                                } else {
                                                                                                                                    embed2.addField('Welcome role :wave:',  `Empty`,true);
                                                                                                                                }
                                                                                                                                if(daServer.muteRole){
                                                                                                                                    embed2.addField('Mute role :mute:', `<@&${daServer.muteRole}>`, true);
                                                                                                                                } else {
                                                                                                                                    embed2.addField('Mute role :mute:',  `Empty`,true);
                                                                                                                                }
                                                                                                    
                                                                                                                                if(daServer.warningRoles.firstwarningRole && daServer.warningRoles.secondWarningRole && daServer.warningRoles.thirdWarningRole){
                                                                                                                                    embed2.addFields(
                                                                                                                                        {name:'First warning role :one:', value:`<@&${daServer.warningRoles.firstwarningRole}>`, inline:true},
                                                                                                                                        {name:'Second warning role :two:', value:`<@&${daServer.warningRoles.secondWarningRole}>`, inline:true},
                                                                                                                                        {name:'Third warning role :three:', value:`<@&${daServer.warningRoles.thirdWarningRole}>`, inline:true},
                                                                                                                                )} else {
                                                                                                                                    embed2.addFields(
                                                                                                                                        {name:'First warning role :one:', value:`Empty`, inline:true},
                                                                                                                                        {name:'Second warning role :two:', value:`Empty`, inline:true},
                                                                                                                                        {name:'Third warning role :three:', value:`Empty`, inline:true},
                                                                                                                                )}
                                                                                                                                
                                                                                                                                embed2.addFields(
                                                                                                                                    {name:'Delete messages in logs? :x:', value:`${daServer.deleteMessagesInLogs}`, inline:true},
                                                                                                                                    {name:'Delete failed commands?:clock1:', value:`${daServer.deleteFailedCommands}`, inline:true},
                                                                                                                                    {name:'Language :abc:', value:`${daServer.language}`, inline:true},
                                                                                                                                    {name:'Prefix :information_source:', value:`${daServer.prefix}`, inline:true},
                                                                                                                                    {name:'Default embed color :white_large_square:', value:`${daServer.defaultEmbedColor}`, inline:true}
                                                                                                                                );
                                                                                                                                message.channel.send(embed2);
                                                                                                                                return true;
                                                                                                                            
                                                                                                                        
                                                                                                                    }).catch(e => {message.channel.send(idleMessage)});
                                                                                                            }).catch(e => {message.channel.send(idleMessage)});

                                                                                                        }).catch(e => {message.channel.send(idleMessage)});
                                                                                                    })
                                                                                                    .catch(e => {message.channel.send(idleMessage)});
                                                                                            }).catch(e => {message.channel.send(idleMessage)});
                                                                            }).catch(e => {message.channel.send(idleMessage)});
                                                                }).catch(e => {message.channel.send(idleMessage)});                                                                    
                                                                }).catch(e => {message.channel.send(idleMessage)});
                                                        }).catch(e => {message.channel.send(idleMessage)});
                                }).catch(e => {message.channel.send(idleMessage)});
                                });
            } else if(!args.length){
                const embed = makeEmbed("Server configurations", `Your server configuration look like this:\nType "${server.prefix}server \`value\`" to edit a selected option.\nExample:${server.prefix}server hiByeChannel`, server);
                if(server.hiByeChannel){
                    embed.addField('Welcome channel :wave:', `<#${server.hiByeChannel}>\nvalue: \`hiByeChannel\``, true);
                }else {
                    embed.addField('Welcome channel :wave:', `Empty\nvalue: \`hiByeChannel\``, true);
                }
                if(server.hiRole){
                    embed.addField('Welcome role :wave:', `<@&${server.hiRole}>\nvalue: \`hiRole\``, true);
                } else {
                    embed.addField('Welcome role :wave:',  `Empty\nvalue: \`hiRole\``,true);
                }
                if(daServer.muteRole){
                    embed.addField('Mute role :mute:', `<@&${daServer.muteRole}>\nvalue: \`muteRole\``, true);
                } else {
                    embed.addField('Mute role :mute:',  `Empty\nvalue: \`muteRole\``,true);
                }

                if(server.warningRoles.firstwarningRole && server.warningRoles.secondWarningRole && server.warningRoles.thirdWarningRole){
                    embed.addFields(
                        {name:'First warning role :one:', value:`<@&${server.warningRoles.firstwarningRole}>\nvalue: \`1\``, inline:true},
                        {name:'Second warning role :two:', value:`<@&${server.warningRoles.secondWarningRole}>\nvalue: \`2\``, inline:true},
                        {name:'Third warning role :three:', value:`<@&${server.warningRoles.thirdWarningRole}>\nvalue: \`3\``, inline:true},
                )} else {
                    embed.addFields(
                        {name:'First warning role :one:', value:`Empty\nvalue: \`1\``, inline:true},
                        {name:'Second warning role :two:', value:`Empty\nvalue: \`2\``, inline:true},
                        {name:'Third warning role :three:', value:`Empty\nvalue: \`3\``, inline:true},
                )}
                            
                embed.addFields(
                    {name:'Delete messages in logs? :x:', value:`${server.deleteMessagesInLogs}\nvalue: \`deleteInLogs\``, inline:true},
                    {name:'Delete failed commands?:clock1:', value:`${server.deleteFailedCommands}\nvalue: \`deleteFails\``, inline:true},
                    {name:'Language :abc:', value:`${server.language}`, inline:true},
                    {name:'Prefix :information_source:', value:`${server.prefix}`, inline:true},
                    {name:'Default embed color :white_large_square:', value:`${server.defaultEmbedColor}`, inline:true}
                );
                message.channel.send(embed);

            } else {
                let daServer = server;
                switch (args[0].toLowerCase()) {
                    case "hibyechannel":
                        let embedo = makeEmbed("Server Settings", `${type0Message}**Enter  your welcoming channel.👋**`, server);
                        message.channel.send(embedo)
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
                                                message.channel.send(`Channel set✅\n**Welcome channel has been successfully updated.**`)
                                                guildsCache[message.guild.id] = daServer;
                                            } finally{
                                                console.log("WROTE TO DATABASE");
                                                mongoose.connection.close();
                                            }
                                        });
                                    });
                            });
                        break;
                    case "hirole":
                        let embedo1 = makeEmbed("Server Settings", `${type0Message}**Enter  your welcoming role.👋**`, server);
                        message.channel.send(embedo1)
                            .then(m => {
                                message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
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
                                                message.channel.send(`Channel set✅\n**Welcome role has been successfully updated.**`)
                                                guildsCache[message.guild.id] = daServer;
                                            } finally{
                                                console.log("WROTE TO DATABASE");
                                                mongoose.connection.close();
                                            }
                                        });
                                    });
                            });
                        break;
                    case "muterole":
                        let embedo2 = makeEmbed("Server Settings", `${type0Message}**Enter  your Mute role.🔇**`, server);
                        message.channel.send(embedo2)
                            .then(m => {
                                message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
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
                                                message.channel.send(`Channel set✅\n**Mute role has been successfully updated.**`)
                                                guildsCache[message.guild.id] = daServer;
                                            } finally{
                                                console.log("WROTE TO DATABASE");
                                                mongoose.connection.close();
                                            }
                                        });
                                    });
                            });
                        break;
                    case "1":
                        let embedo3 = makeEmbed("Server Settings", `${type0Message}**Enter  your first warning role.1️⃣**`, server);
                        message.channel.send(embedo3)
                            .then(m => {
                                message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
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
                                                daServer.warningRoles.firstwarningRole = "";
                                                break;
                                            default:
                                                daServer.warningRoles.firstwarningRole = toCheck;
                                                break;
                                        }
                                        await mongo().then(async (mongoose) =>{
                                            try{ 
                                                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                    warningRoles: daServer.warningRoles,
                                                },{upsert:false});
                                                message.channel.send(`Channel set✅\n**The first warning role has been successfully updated.**`)
                                                guildsCache[message.guild.id] = daServer;
                                            } finally{
                                                console.log("WROTE TO DATABASE");
                                                mongoose.connection.close();
                                            }
                                        });
                                    });
                            });
                        break;
                    case "2":
                        let embedo4 = makeEmbed("Server Settings", `${type0Message}**Enter  your second warning role.2️⃣**`, server);
                        message.channel.send(embedo4)
                            .then(m => {
                                message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
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
                                                daServer.warningRoles.secondWarningRole = "";
                                                break;
                                            default:
                                                daServer.warningRoles.secondWarningRole = toCheck;
                                                break;
                                        }
                                        await mongo().then(async (mongoose) =>{
                                            try{ 
                                                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                    warningRoles: daServer.warningRoles,
                                                },{upsert:false});
                                                message.channel.send(`Channel set✅\n**The second warning role has been successfully updated.**`)
                                                guildsCache[message.guild.id] = daServer;
                                            } finally{
                                                console.log("WROTE TO DATABASE");
                                                mongoose.connection.close();
                                            }
                                        });
                                    });
                            });
                        break; 
                    case "3":
                        let embedo5 = makeEmbed("Server Settings", `${type0Message}**Enter  your third warning role.3️⃣**`, server);
                        message.channel.send(embedo5)
                            .then(m => {
                                message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
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
                                                daServer.warningRoles.thirdWarningRole = "";
                                                break;
                                            default:
                                                daServer.warningRoles.thirdWarningRole = toCheck;
                                                break;
                                        }
                                        await mongo().then(async (mongoose) =>{
                                            try{ 
                                                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                    warningRoles: daServer.warningRoles,
                                                },{upsert:false});
                                                message.channel.send(`Channel set✅\n**The third warning role has been successfully updated.**`)
                                                guildsCache[message.guild.id] = daServer;
                                            } finally{
                                                console.log("WROTE TO DATABASE");
                                                mongoose.connection.close();
                                            }
                                        });
                                    });
                            });
                        break;
                    case "deleteinlogs":
                        let embedo6 = makeEmbed("Server Settings", `**Do you want messages to be deleted in logs?❌ \n[✅ is yes ❌ is no]**`, server);
                        message.channel.send(embedo6)
                        .then(async m => {
                            m.react("✅");
                            m.react("❌");
                            m.awaitReactions(reactionFilter, { max : 1,time: 120000, errors : ["time"] })
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
                                            message.channel.send(`Channel set✅\n**Boolean status has been successfully updated.**`)
                                            guildsCache[message.guild.id] = daServer;
                                        } finally{
                                            console.log("WROTE TO DATABASE");
                                            mongoose.connection.close();
                                        }
                                    });
                                })
                            });
                        break; 
                    case "deletefails":
                        let embedo7 = makeEmbed("Server Settings", `**Do you want failed commands to be deleted after a few seconds?🕐\n[✅ is yes ❌ is no]**`, server);
                        message.channel.send(embedo7)
                        .then(async m => {
                            m.react("✅");
                            m.react("❌");
                            m.awaitReactions(reactionFilter, { max : 1,time: 120000, errors : ["time"] })
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
                                            message.channel.send(`Channel set✅\n**Boolean status has been successfully updated.**`)
                                            guildsCache[message.guild.id] = daServer;
                                        } finally{
                                            console.log("WROTE TO DATABASE");
                                            mongoose.connection.close();
                                        }
                                    });
                                })
                            });
                        break;                                    
                    default:
                        message.channel.send("Invalid value.");
                        break;
                }
            }
        } catch (err) {console.log(err);}
 
	},

};