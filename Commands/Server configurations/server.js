const makeEmbed = require('../../functions/embed');
const fs = require("fs");
const sendAndDelete = require("../../functions/sendAndDelete");
const type0Message = "(type `0` to cancel / type \"`no`\" for none)\n"; 
const idleMessage = "Command cancelled due to the user being idle";
const cancerCultureMessage = "Command cancelled successfully";
const checkChannels = require("../../functions/Response based Checkers/checkChannels");
const checkRoles = require("../../functions/Response based Checkers/checkRoles");

module.exports = {
	name : 'server',
	description : 'modifies the settings of the server',
	usage:'!server',
	whiteList:'ADMINISTRATOR',
	execute(message, args, server) {
        
        let embed = makeEmbed("Server Settings", `${type0Message}**Enter  your welcoming channel.**`, server);
        const messageFilter = m => !m.author.bot && m.author.id === message.author.id;
        const reactionFilter = (react, noob) => noob.id === message.author.id && !noob.bot;
        fs.readFile("./servers.json", 'utf-8', (err, config)=>{
		
            try {
                const JsonedDB = JSON.parse(config);
                for( i of JsonedDB) {
                    if (message.guild.id === i.guildId){
                        let daServer = i;
                        if(!i.isSet){
                            message.channel.send(embed)
                                .then(m => {
                                      message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                        .then(a => {      
                                            switch (checkChannels(a)) {
                                                case "not valid":
                                                case "no args": 
                                                case "not useable":              
                                                    return message.channel.send("Invalid argument, command failed.");
                                                    break;
                                                case "cancel":
                                                    return message.channel.send(cancerCultureMessage);
                                                    break;
                                                case "no":
                                                    daServer.hiByeChannel = "";
                                                    break;
                                                default:
                                                    daServer.hiByeChannel = checkChannels(a);
                                                    break;
                                            }
                                            embed.setDescription(`${type0Message} **Enter your welcoming role.**`);
                                            m.edit(embed);

                                            message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                .then(a => {
                                                    switch (checkRoles(a)) {
                                                        case "not valid":
                                                        case "not useable":
                                                        case "no args":               
                                                            return message.channel.send("Invalid argument, command failed.");
                                                            break;
                                                        case "cancel":
                                                            return message.channel.send(cancerCultureMessage);
                                                            break;
                                                        case "no":
                                                            daServer.hiRole = "";
                                                            break;
                                                        default:
                                                            
                                                            daServer.hiRole = checkRoles(a);
                                                            break;
                                                    }
                                                        embed.setDescription(`${type0Message} **Enter your first warning role.**`);
                                                            m.edit(embed);
                                                            message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                                .then(a => {  
                                                                    switch (checkRoles(a)) {
                                                                        case "not valid":
                                                                        case "not useable":
                                                                        case "no args":               
                                                                            return message.channel.send("Invalid argument, command failed.");
                                                                            break;
                                                                        case "cancel":
                                                                            return message.channel.send(cancerCultureMessage);
                                                                            break;
                                                                        case "no":
                                                                            daServer.warningRoles.firstwarningRole = "";
                                                                            break;
                                                                        default:
                                                                            
                                                                            daServer.warningRoles.firstwarningRole = checkRoles(a);
                                                                            break;
                                                                    }  
                                                                        embed.setDescription(`${type0Message} **Enter your second warning role.**`);
                                                                        m.edit(embed);
                                                                        message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                                            .then(a => {  
                                                                                
                                                                                switch (checkRoles(a)) {
                                                                                    case "not valid":
                                                                                    case "not useable":
                                                                                    case "no args":               
                                                                                        return message.channel.send("Invalid argument, command failed.");
                                                                                        break;
                                                                                    case "cancel":
                                                                                        return message.channel.send(cancerCultureMessage);
                                                                                        break;
                                                                                    case "no":
                                                                                        daServer.warningRoles.secondWarningRole = "";
                                                                                        break;
                                                                                    default:
                                                                                        
                                                                                        daServer.warningRoles.secondWarningRole = checkRoles(a);
                                                                                        break;
                                                                                } 
                                                                                
                                                                                embed.setDescription(`${type0Message} **Enter your third warning role.**`);
                                                                                m.edit(embed);
            
                                                                                message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                                                    .then(a => {    

                                                                                        switch (checkRoles(a)) {
                                                                                            case "not valid":
                                                                                            case "not useable":
                                                                                            case "no args":               
                                                                                                return message.channel.send("Invalid argument, command failed.");
                                                                                                break;
                                                                                            case "cancel":
                                                                                                return message.channel.send(cancerCultureMessage);
                                                                                                break;
                                                                                            case "no":
                                                                                                daServer.warningRoles.thirdWarningRole = "";
                                                                                                break;
                                                                                            default:
                                                                                                
                                                                                                daServer.warningRoles.thirdWarningRole = checkRoles(a);
                                                                                                break;
                                                                                        } 
                                                                                    
                                                                                        embed.setDescription(`**Do you want messages to be deleted in logs ?\n[✅ is yes ❌ is no]**`);
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
                                                                                                                return message.channel.send(cancerCultureMessage);
                                                                                                                break;
                                                                                                        }
                                                                                                        m.reactions.removeAll();
                                                                                                        embed.setDescription(`**Do you want failed commands to be deleted after a few seconds ?\n[✅ is yes ❌ is no]**`);
                                                                                                        m.edit(embed)
                                                                                                            .then(m => {
                                                                                                                m.react("✅");
                                                                                                                m.react("❌");
                                                                                                                m.awaitReactions(reactionFilter, { max : 1,time: 120000, errors : ["time"] })
                                                                                                                    .then(a =>{
                                                                                                                        
                                                                                                                        switch (a.first().emoji.name) {
                                                                                                                            case "✅":
                                                                                                                                daServer.deleteFailedCommands = true;
                                                                                                                                break;
                                                                                                                            case "❌":
                                                                                                                                daServer.deleteFailedCommands = false;
                                                                                                                                break;
                                                                                                                            default:
                                                                                                                                return message.channel.send(cancerCultureMessage);
                                                                                                                                break;
                                                                                                                        }


                                                                                                                        daServer.isSet = true;
                                                                                                                        i = daServer
                
                                                                                                                        fs.writeFile("./servers.json", JSON.stringify(JsonedDB, null, 2), err => {
                                
                                                                                                                            if(err) {
                                                                                                                            message.channel.send('There was a problem with the bot:x:,check the console or contact the developer to fix this');
                                                                                                                            console.log(err);
                                                                                                                            } else {
                
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
                                                                                                                                return message.channel.send(embed2);
                                                                                                                            }
                                                                                                                        });
                                                                                                                    }).catch(e => message.channel.send(idleMessage));
                                                                                                            }).catch(e => message.channel.send(idleMessage));

                                                                                                        
                                                                                                    })
                                                                                                    .catch(e => {message.channel.send(idleMessage)})
                                                                                            }).catch(e => {message.channel.send(idleMessage)})

                                                                                     
                                                                            }).catch(e => message.channel.send(idleMessage))
                                                                }).catch(e => message.channel.send(idleMessage))
                                                                    
                                                                    
                                                                }).catch(e => message.channel.send(idleMessage))                          
                                                        }).catch(e => message.channel.send(idleMessage))   
                                    
                                }).catch(e => {message.channel.send(idleMessage)})   
                                });
                        } else {
                            const embed = makeEmbed("Server configurations", `Your server configuration look like this:\nType \`reset\` to reset it.`, server);
                            if(server.hiByeChannel){
                                embed.addField('Welcome channel :wave:', `<#${server.hiByeChannel}>`, true);
                            }else {
                                embed.addField('Welcome channel :wave:', `Empty`, true);
                            }
                            if(server.hiRole){
                                embed.addField('Welcome role :wave:', `<@&${server.hiRole}>`, true);
                            } else {
                                embed.addField('Welcome role :wave:',  `Empty`,true);
                            }

                            if(server.warningRoles.firstwarningRole && server.warningRoles.secondWarningRole && server.warningRoles.thirdWarningRole){
                                embed.addFields(
                                    {name:'First warning role :one:', value:`<@&${server.warningRoles.firstwarningRole}>`, inline:true},
                                    {name:'Second warning role :two:', value:`<@&${server.warningRoles.secondWarningRole}>`, inline:true},
                                    {name:'Third warning role :three:', value:`<@&${server.warningRoles.thirdWarningRole}>`, inline:true},
                            )} else {
                                embed.addFields(
                                    {name:'First warning role :one:', value:`Empty`, inline:true},
                                    {name:'Second warning role :two:', value:`Empty`, inline:true},
                                    {name:'Third warning role :three:', value:`Empty`, inline:true},
                            )}
                            
                            embed.addFields(
                                {name:'Delete messages in logs? :x:', value:`${server.deleteMessagesInLogs}`, inline:true},
                                {name:'Delete failed commands?:clock1:', value:`${server.deleteFailedCommands}`, inline:true},
                                {name:'Language :abc:', value:`${server.language}`, inline:true},
                                {name:'Prefix :information_source:', value:`${server.prefix}`, inline:true},
                                {name:'Default embed color :white_large_square:', value:`${server.defaultEmbedColor}`, inline:true}
                            );
                            message.channel.send(embed);
                            const gayFilter = m => !m.author.bot && m.author.id === message.author.id;
                            message.channel.awaitMessages(gayFilter,{max: 1, time : 10000, errors: ['time']})
                                .then(j => {   

                                    if (j.first().content === "reset"){
                                        fs.readFile("./servers.json", 'utf-8', (err, config)=>{
                                            try {
                                                const JsonedDB = JSON.parse(config);
                                                for( i of JsonedDB) {
                                                    if (message.guild.id === i.guildId){
                                                        let daServer = i;
                                                        for (const elememt in daServer) {
                                                            if(typeof daServer[elememt] === "string") daServer[elememt] = "";
                                                        }
                                                        daServer.guildId = message.guild.id;
                                                        daServer.isSet = false;
                                                        daServer.language = "English";
                                                        daServer.prefix = "!";
                                                        daServer.defaultEmbedColor = "#f7f7f7";
                                                        
                                                        i = daServer;
                                                        fs.writeFile("./servers.json", JSON.stringify(JsonedDB, null, 2), err => {
				
                                                            if(err) {
                                                                message.channel.send('There was a problem with the bot:x:,check the console or contact the developer to fix this');
                                                                console.log(err);
                                                            } else {
                                                                message.channel.send("Server configuration have been reset✅.\nType `!server` again to reconfigure your server.");
                                                                return;
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                            catch (err) {console.log(err);}
                                        })
                                    }
                            }).catch(e => e);

                        }
                        	
                    }
                }
            } catch (err) {console.log(err);}
        })
        
       

	},

};