const { response } = require("express");
const fs = require("fs");
const checkUseres = require("../../functions/checkUser");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
const client = require("../.././index");
const checkRoles = require("../../functions/Response based Checkers/checkRoles");
module.exports = {
	name : 'points-enable',
	description : "Enables the ~points~ plugin.",
    cooldown: 60 * 1,
    aliases:["p-enable","enable-points","enable-points"],
	usage:'!points-enable',
    whiteList:'ADMINISTRATOR',
	execute(message, args, server) { 
 
        fs.readFile("./Commands/points/points.json", (err,response) =>{
            if(err){
                console.log(err);
                return false;
            }
            const readableRespnse = JSON.parse(response);
            for(let servery of readableRespnse){
                if(servery.guildID === message.guild.id){
                    if(!server.pointsEnabled){

                        let arrayOfIds = [];
                        client.guilds.cache.get(message.guild.id).members.cache.each(user => (arrayOfIds.push(user.id)));

                        servery.members = {};
                        arrayOfIds.forEach(i => servery.members[i] = 0);
                        servery.isSet = true;
                        const embed = makeEmbed("White listed role.",`Ping the role that you want to be able to modify points.\nType \`no\` for no one except admins.`, server)
                        message.channel.send(embed)
                            const messageFilter = m => !m.author.bot && m.author.id === message.author.id;
                            message.channel.awaitMessages(messageFilter,{max: 1, time : 120000, errors: ['time']})
                            .then(a => {
                                let checkedRole = checkRoles(a);
                                switch (checkedRole) {
                                    case "not valid":
                                    case "not useable":
                                    case "no args":               
                                        message.channel.send("Invalid argument, command failed.");
                                        return false;
                                        break;
                                    case "cancel":
                                    case "no":
                                       servery.whiteListedRole = "";
                                        break;
                                    default:
                                        
                                        servery.whiteListedRole = checkedRole;

                                        fs.writeFile("./Commands/points/points.json", JSON.stringify(readableRespnse, null, 2), err => {
				
                                            if(err) {
                                
                                                console.log(err);
                                                return false;
                                            } else {
                                                const embed = makeEmbed(`Your server points plugin has  been activated ✅.`,``, server,false,"");
                                                message.channel.send(embed);
                                                return true;
                                            }
                                        });
                                        fs.readFile("./servers.json", 'utf-8', (err, config)=>{
                                            if(err){
                                                console.log(err);
                                                return false;
                                            }
                                            const readableR = JSON.parse(config);
                                            for( const ser of readableR){
                                                if(ser.guildId === message.guild.id){
                                                    ser.pointsEnabled = true;
                                                    fs.writeFile("./servers.json", JSON.stringify(readableR, null, 2), err => {
                                                        if(err){
                                                            console.log(err);
                                                            return false;
                                                        }else  return true;
                                                        
                                                    });
                                                    return true;
                                                }
                                            }
                                        });
                                        break;
                                }
                            });
                        return true;
                    } else{
                        const embed = makeEmbed(`Your server points plugin has already been activated.`,`Do "${server.prefix}points" instead.`, server);
                        message.channel.send(embed);
                        return false;
                    }
                }
            }
                    
            return false;
        });
        return true;             
    }
};
