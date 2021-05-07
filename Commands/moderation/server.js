const makeEmbed = require('../../functions/embed');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../../config.json");
const fs = require("fs");
const sendAndDelete = require("../../functions/sendAndDelete");
const type0Message = "(type `0` to cancel / type \"`no`\" for none)\n"; 
const idleMessage = "Command cancelled due to the user being idle";
/*
    {
    "guildId": "",
    "hiByeChannel": "",
    "hiRole": "",
    "hiByeLog": "",
    "deleteLog": "",
    "serverLog": "",
    "warningLog": "",
    "deleteMessagesInLogs": true,
    "deleteFailedCommands": true,
    "isSet":false,
    "warningRoles": {
      "firstwarningRole":"",
      "secondWarningRole":"",
      "thirdWarningRole":""
    }
 */
module.exports = {
	name : 'server',
	description : 'modifies the settings of the server',
	usage:'!server',
	whiteList:'ADMINISTRATOR',
	execute(message, args, server) {
        
        let embed = makeEmbed("Server Settings", `${type0Message}**Type the id of your welcoming channel.**`,false);
        const messageFilter = m => !m.author.bot && m.author.id === message.author.id;

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
                                            let msg = a.first().content;
                                                          
                                            if(msg === "0") return message.channel.send("Command cancelled successfully");
                                            if(isNaN(parseInt(msg)) && msg.toLowerCase() !=="no")return message.channel.send("Invalid argument, command failed.");
                                        
                                            daServer.hiByeChannel = msg;
                                            if(msg.toLowerCase() === "no") daServer.hiByeChannel = "";

                                            embed.setDescription(`${type0Message} **Type the id of your welcoming role.**`);
                                            m.edit(embed);

                                            message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                .then(a => {    
                                                    let msg = a.first().content;
                                                                          
                                                    if(msg === "0") return message.channel.send("Command cancelled successfully");
                                                    if(isNaN(parseInt(msg)) && msg.toLowerCase() !=="no")return message.channel.send("Invalid argument, command failed.");
                                                    
                                                    
                                                        daServer.hiRole = msg;

                                                        if(msg.toLowerCase() === "no")daServer.hiRole = "";

                                                        

                                                         
                                                                        embed.setDescription(`${type0Message} **Type the id of your first warning role.**`);
                                                                        m.edit(embed);
                                                                        message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                                            .then(a => {    
                                                                                let msg = a.first().content;
                                                                   
                                                                            
                                                                                if(msg === "0") return message.channel.send("Command cancelled successfully");
                                                                                if(isNaN(parseInt(msg)) && msg.toLowerCase() !=="no")return message.channel.send("Invalid argument, command failed.");
                                                                                
                                                                                
                                                                                    daServer.warningRoles.firstwarningRole = msg;
                                                                                    
                                                                        if(msg.toLowerCase() === "no")daServer.warningRoles.firstwarningRole = "";


                                                                        embed.setDescription(`${type0Message} **Type the id of your second warning role.**`);
                                                                        m.edit(embed);
                                                                        message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                                            .then(a => {    
                                                                                let msg = a.first().content;
                                                                   
                                                                            
                                                                                if(msg === "0") return message.channel.send("Command cancelled successfully");
                                                                                if(isNaN(parseInt(msg)) && msg.toLowerCase() !=="no")return message.channel.send("Invalid argument, command failed.");
                                                                                
                                                                                
                                                                                    daServer.warningRoles.secondWarningRole = msg;
                                                                                    
                                                                                    if(msg.toLowerCase() === "no")daServer.warningRoles.secondWarningRole = "";
                                                                                    


                                                                                    embed.setDescription(`${type0Message} **Type the id of your third warning role.**`);
                                                                                    m.edit(embed);
                                                                                    message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                                                .then(a => {    
                                                                    let msg = a.first().content;
                                                                               
                                                                
                                                                    if(msg === "0") return message.channel.send("Command cancelled successfully");
                                                                    if(isNaN(parseInt(msg)) && msg.toLowerCase() !=="no")return message.channel.send("Invalid argument, command failed.");
                                                                    
                                                                    
                                                                        daServer.warningRoles.thirdWarningRole = msg;
                                
                                                                        if(msg.toLowerCase() === "no")daServer.warningRoles.thirdWarningRole = "";
                                                                        daServer.isSet = true;
                                                                        i = daServer

                                                                        fs.writeFile("./servers.json", JSON.stringify(JsonedDB, null, 2), err => {
				
                                                                            if(err) {
                                                                                message.channel.send('There was a problem with the bot:x:,check the console or contact the developer to fix this');
                                                                                console.log(err);
                                                                            } else {
                                                                                
                                                                                let embed2 = makeEmbed("Done! your server setting have been set ✅",`Your server object looks like this:\n \`${JSON.stringify(daServer)}\``);

                                                                                return message.channel.send(embed2);
                                                                            }
                                                                        });
                                                                    
                                                                })
                                                                                    .catch(e => message.channel.send(idleMessage))
                                                                                
                                                                            })
                                                                        .catch(e => message.channel.send(idleMessage))
                                                                    
                                                                    
                                                                })
                                                                                    .catch(e => message.channel.send(idleMessage))
                                                                                
                                                                                
                                                                            
                                                                    
                                                                
                                                                                
                                                                            })
                                                                        .catch(e => message.channel.send(idleMessage))
                                                                    
                                                                
                                                        
                                                    
                                            
                                        })
                                .catch(e => message.channel.send(idleMessage))   
                            });
                        } else {
                            const embed = makeEmbed("Server settings", `Your server object looks like this:\n \`${JSON.stringify(daServer)}\`\nType \`reset\` to reset it.`, false);
                            message.channel.send(embed);
                            const gayFilter = m => !m.author.bot && m.author.id === message.author.id;
                            message.channel.awaitMessages(gayFilter,{max: 1, time : 120000, errors: ['time']})
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
                                                            if(typeof daServer[elememt] === "object") daServer[elememt] = {};
                                                            
                                                        }
                                                        daServer.guildId = message.guild.id;
                                                        daServer.isSet = false;
                                                        daServer.language = "English";
                                                        daServer.prefix = "!";
                                                        i = daServer;
                                                        fs.writeFile("./servers.json", JSON.stringify(JsonedDB, null, 2), err => {
				
                                                            if(err) {
                                                                message.channel.send('There was a problem with the bot:x:,check the console or contact the developer to fix this');
                                                                console.log(err);
                                                            } else {
                                                                message.channel.send("Server object has been reset.");
                                                                return;
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                            catch (err) {console.log(err);}
                                        })
                                    }
                            }).catch(e=>e);

                        }
                        	
                    }
                }
            } catch (err) {console.log(err);}
        })
        
       

	},

};