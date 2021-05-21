const { response } = require("express");
const fs = require("fs");
const checkUseres = require("../../functions/checkUser");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
module.exports = {
	name : 'points-add',
	description : "Adds points to a member in the server",
    aliases:["p-add","p+","points+","points-give","p-give"],
    cooldown: 5,
    whiteList:'ADMINISTRATOR',
	usage:'!points-add <@user> <number>',
	execute(message, args, server) { 
        const target = checkUseres(message, args, 0);
        switch (target) {
                case "not valid":
                case "everyone":	
                case "not useable":
                    
                    const embed1 = makeEmbed('invalid username',this.usage, server);
                    sendAndDelete(message,embed1, server);
                    return false;
                    break;
                case "no args": 
                    const embed2 = makeEmbed('Missing arguments',this.usage, server);
                    sendAndDelete(message,embed2, server);
                    return false;		
                    break;
                default:
                    if(!args[1]){
                        const embed2 = makeEmbed('Missing arguments',this.usage, server);
                        sendAndDelete(message,embed2, server);
                        return false;
                    } else if(parseInt(args[1]) === NaN){
                        const embed2 = makeEmbed('Missing arguments',this.usage, server);
                        sendAndDelete(message,embed2, server);
                        return false;
                    }
                    fs.readFile("./Commands/points/points.json", (err,response) =>{
                        if(err){
                            console.log(err);
                            return false;
                        }
                        const readableRespnse = JSON.parse(response);
                        for(let servery of readableRespnse){
                            if(servery.guildID === message.guild.id){
                                servery.members[target] += parseInt(args[1]);
                                if(server.pointsEnabled){
                                    fs.writeFile("./Commands/points/points.json", JSON.stringify(readableRespnse, null, 2), err => {
                                        if(err){
                                            console.log(err);
                                            return false;
                                        }else  {
                                            const variable = makeEmbed("points added ✅",`${args[1]} points added to <@${target}>`, server);
                                            message.channel.send(variable);                              
                                            return true;
                                        }
                                        
                                    });
                                    
                                } else{
                                    const embed =makeEmbed(`Your server points plugin isn't active yet.`,`Do "${server.prefix}points-enable" Instead.`, server)
                                    sendAndDelete(message, embed, server);
                                    return false;
                                }
                            }
                        }
                        
                        return false;
                    });
                    return true;
                    break;
            }
        
		
	},

};
