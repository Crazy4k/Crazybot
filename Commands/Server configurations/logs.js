const makeEmbed = require('../../functions/embed');
const fs = require("fs");
const sendAndDelete = require("../../functions/sendAndDelete");
const checkChannels = require("../../functions/Response based Checkers/checkChannels");


const type0Message = "(type `0` to cancel / type \"`no`\" for none)\n"; 
const idleMessage = "Command cancelled due to the user being idle";
const invalidargMessage = "Invalid argument, command failed.";
const cancerCultureMessage ="Command cancelled successfully";

module.exports = {
	name : 'logs',
	description : 'modifies the logs of the server',
	usage:'!logs',
    cooldown: 60 * 5,
	whiteList:'ADMINISTRATOR',
	execute(message, args, server) {
        let embed = makeEmbed("Server Settings", `${type0Message}**Enter of your members logging channel.**`, server);
        const messageFilter = m => !m.author.bot && m.author.id === message.author.id;
        fs.readFile("./servers.json", 'utf-8', (err, config)=>{
            try {
                const JsonedDB = JSON.parse(config);
                for( i of JsonedDB) {
                if (message.guild.id === i.guildId){
                        let daServer = i;
                        if(daServer.logs.isSet === false){
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
                                            embed.setDescription(`${type0Message} **Enter of your messages logging channel.**`);
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
                                                    
                                                    embed.setDescription(`${type0Message} **Enter of your server logging channel.**`);
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
                                                            embed.setDescription(`${type0Message} **Enter of your warnings logging channel.**`);
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
                                                                            daServer.logs.warningLog = "";
                                                                            break;
                                                                        default:
                                                                            daServer.logs.warningLog = checkChannels(a);
                                                                            break;
                                                                    }
                                        
                                                                    daServer.logs.isSet = true;
                                                                    i = daServer                                       
                                                                    fs.writeFile("./servers.json", JSON.stringify(JsonedDB, null, 2), err => {				
                                                                        if(err) {
                                                                            message.channel.send('There was a problem with the bot:x:,check the console or contact the developer to fix this');
                                                                            console.log(err);
                                                                        } else {
                                                
                                                                            let embed2 = makeEmbed("Done! your server setting have been set ✅",`Your server logs looks like this:\n `, server);
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
                                                                        }
                                                                    });
                                                            }).catch(e => {message.channel.send(idleMessage)});
                                                    }).catch(e => {message.channel.send(idleMessage)});
                                            }).catch(e => {message.channel.send(idleMessage)});
                                        })
                                    }).catch(e => {message.channel.send(idleMessage)});
                        } else {
                            const embed = makeEmbed("Server settings", `Your server logging channels are this:\nType \`reset\` to reset it.`, server);
                            if(daServer.logs.hiByeLog){
                                embed.addField("Member logs :bust_in_silhouette:", `<#${daServer.logs.hiByeLog}>`, true);
                            }else{
                                embed.addField("Member logs :bust_in_silhouette:", `Empty`, true)
                            }
                            if(daServer.logs.deleteLog){
                                embed.addField("Messages logs :mailbox_with_mail:", `<#${daServer.logs.deleteLog}>`, true);
                            }else{
                                embed.addField("Messages logs :mailbox_with_mail:", `Empty`, true)
                            }
                            if(daServer.logs.deleteLog){
                                embed.addField("Server logs :house:", `<#${daServer.logs.serverLog}>`, true);
                            }else{
                                embed.addField("Server logs :house:", `Empty`, true)
                            }
                            if(daServer.logs.deleteLog){
                                embed.addField("Warn logs :hammer:", `<#${daServer.logs.warningLog}>`, true);
                            }else{
                                embed.addField("Warn logs:hammer:", `Empty`, true)
                            }
                            
                            message.channel.send(embed);

                            const gayFilter = m => !m.author.bot && m.author.id === message.author.id;
                            message.channel.awaitMessages(gayFilter,{max: 1, time : 20000, errors: ['time']})
                                .then(j => {           
                                    if (j.first().content === "reset"){
                                        fs.readFile("./servers.json", 'utf-8', (err, config)=>{
                                            try {
                                                const JsonedDB = JSON.parse(config);
                                                    for( i of JsonedDB) {
                                                        if (message.guild.id === i.guildId){
                                                            let daServer = i;
                            
                                                            daServer.logs.hiByeLog = "";
                                                            daServer.logs.warningLog = "";
                                                            daServer.logs.serverLog = "";
                                                            daServer.logs.deleteLog = "";
                                                            daServer.logs.isSet = false;
                                                            i = daServer;
                                                            fs.writeFile("./servers.json", JSON.stringify(JsonedDB, null, 2), err => {			
                                                                if(err) {
                                                                    message.channel.send('There was a problem with the bot:x:,check the console or contact the developer to fix this');
                                                                    console.log(err);
                                                                } else {
                                                                    message.channel.send("Logs have been reset");
                                                                    return true;
                                                                }
                                                            });
                                                        }
                                                    }
                                            }catch (err) {console.log(err);}
                                        })
                                    }
                                })
                                .catch(e=>e);

                        }
                    }}
            } catch (err) {console.log(err);}
        })
	}

};