const makeEmbed = require('../../functions/embed');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../../config.json");
const fs = require("fs");
const sendAndDelete = require("../../functions/sendAndDelete");



const type0Message = "(type `0` to cancel / type \"`no`\" for none)\n"; 
const idleMessage = "Command cancelled due to the user being idle";
const invalidargMessage = "Invalid argument, command failed.";
const cancerCultureMessage ="Command cancelled successfully";

module.exports = {
	name : 'logs',
	description : 'modifies the settings of the server',
	usage:'!logs',
	whiteList:'ADMINISTRATOR',
	execute(message, args, server) {
        let embed = makeEmbed("Server Settings", `${type0Message}**Type the id of your members logging channel.**`,false);
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
                                            let msg = a.first().content;
                                        
                                        if(msg === "0") return message.channel.send(cancerCultureMessage);
                                        if(isNaN(parseInt(msg)) && msg.toLowerCase() !=="no")return message.channel.send(invalidargMessage);
                                        daServer.logs.hiByeLog = msg;
                                        if(msg.toLowerCase() === "no") daServer.logs.hiByeLog = "";


                                        embed.setDescription(`${type0Message} **Type the id of your messages logging channel.**`);
                                        m.edit(embed);

                                        message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                            .then(a => {    
                                                let msg = a.first().content;
                                                          
                                                if(msg === "0") return message.channel.send(cancerCultureMessage);
                                                if(isNaN(parseInt(msg)) && msg.toLowerCase() !=="no")return message.channel.send(invalidargMessage);
                                                daServer.logs.deleteLog = msg;
                                                if(msg.toLowerCase() === "no") daServer.logs.deleteLog = "";


                                                embed.setDescription(`${type0Message} **Type the id of your server logging channel.**`);
                                                m.edit(embed);

                                message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                .then(a => {    
                                    let msg = a.first().content;
                                                          
                                    if(msg === "0") return message.channel.send(cancerCultureMessage);
                                    if(isNaN(parseInt(msg)) && msg.toLowerCase() !=="no")return message.channel.send(invalidargMessage);
                                    daServer.logs.serverLog = msg;
                                    if(msg.toLowerCase() === "no") daServer.logs.serverLog= "";


                                    embed.setDescription(`${type0Message} **Type the id of your warnings logging channel.**`);
                                    m.edit(embed);



                                    message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                                    .then(a => {    
                                        let msg = a.first().content;
                                                              
                                        if(msg === "0") return message.channel.send(cancerCultureMessage);
                                        if(isNaN(parseInt(msg)) && msg.toLowerCase() !=="no")return message.channel.send(invalidargMessage);
                                        daServer.logs.warningLog = msg;
                                        if(msg.toLowerCase() === "no") daServer.logs.warningLog= "";
    
                                        
                                        daServer.logs.isSet = true;
                                        i = daServer
                                       
                                            fs.writeFile("./servers.json", JSON.stringify(JsonedDB, null, 2), err => {
				
                                                if(err) {
                                                    message.channel.send('There was a problem with the bot:x:,check the console or contact the developer to fix this');
                                                    console.log(err);
                                                } else {
                                                    
                                                    let embed2 = makeEmbed("Done! your server setting have been set ✅",`Your server logs looks like this:\n `);
                                                    embed2.addFields(
                                                        {name:'Join and leave logs', value: `"${daServer.logs.hiByeLog}"`, inline:false},
                                                        {name:'Messages logs', value:`"${daServer.logs.deleteLog}"`, inline:false},
                                                        {name:'Server logs', value:`"${daServer.logs.serverLog}"`, inline:false},
                                                        {name:'Warn logs', value:`"${daServer.logs.warningLog}"`, inline:false}
                                                    );

                                                    return message.channel.send(embed2);
                                                }
                                            });
                                        
    
                                    }).catch(e => message.channel.send(idleMessage))
                                }).catch(e => message.channel.send(idleMessage))

                            }).catch(e => message.channel.send(idleMessage))
                        })
                    }).catch(e => message.channel.send(idleMessage))
        } else {
            const embed = makeEmbed("Server settings", `Your server logging channels Id's are this:\nType \`reset\` to reset it.`, false);
            embed.addFields(
                {name:'Join and leave logs', value: `"${server.logs.hiByeLog}"`, inline:false},
                {name:'Messages logs', value:`"${server.logs.deleteLog}"`, inline:false},
                {name:'Server logs', value:`"${server.logs.serverLog}"`, inline:false},
                {name:'Warn logs', value:`"${server.logs.warningLog}"`, inline:false}
            );
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
    }}
        } catch (err) {console.log(err);}
        })
	},

};