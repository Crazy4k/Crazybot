const { response } = require("express");
const fs = require("fs");
const checkUseres = require("../../functions/checkUser");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
module.exports = {
	name : 'points',
	description : "shows your total points",
    aliases:["p"],
    cooldown: 5,
	usage:'!points <@user>',
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
                    fs.readFile("./Commands/points/points.json", (err,response) =>{
                        if(err){
                            console.log(err);
                            return false;
                        }
                        const readableRespnse = JSON.parse(response);
                        for(let servery of readableRespnse){
                            if(servery.guildID === message.guild.id){
                                if(server.pointsEnabled){
                                    message.channel.send(servery.members[target]);                                    
                                    return true;
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
