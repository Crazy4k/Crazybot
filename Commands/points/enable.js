const { response } = require("express");
const fs = require("fs");
const checkUseres = require("../../functions/checkUser");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
const client = require("../.././index");
module.exports = {
	name : 'points-enable',
	description : "Enables the ~points~ plugin.",
    cooldown: 60 * 1,
    aliases:["p-enable","enable-points","enable-points"],
	usage:'!points-enable',
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
