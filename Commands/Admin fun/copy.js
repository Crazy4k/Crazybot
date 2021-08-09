const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require('../../functions/sendAndDelete');
const im = ["i'm","im","i am", "i m", "Im", "I'm", "I am"];
const insults = ["ugly","fat","dumb", "noob"];

module.exports = {
	name : 'copy',
    aliases: ["lol","annoy"],
	description : 'Makes the bot copy every message that the <@user> says for 1.5 minutes.',
    cooldown: 60 * 3,
    category:"admin fun",
	usage:'copy <@user>',
	whiteList : ['ADMINISTRATOR'],

	execute(message, args, server ) {
        const number = checkUseres(message, args, 0);
        switch (number) {
            case "not valid":
            case "everyone":	
            case "not useable":
                try {
        
                    const embed = makeEmbed('invalid username',this.usage, server);
                    sendAndDelete(message, embed,server);
                    return false;
            
                } catch (error) {
                    console.error(error);
                    return false;
                }
                break;
            case "no args": 
                const embed = makeEmbed('Missing arguments',this.usage, server);
                sendAndDelete(message, embed,server);
                return false;
                break;
                               
            default:
                message.channel.send("ok");
                
                const filter = m => !m.author.bot && m.author.id === number;
		        const collector = message.channel.createMessageCollector({filter,time:150000});
                collector.on("collect", m => {
                    
                    let tureflase =[false, false];
                    let agrs = m.content.split(" ");
                    im.forEach(element => {
                        if(agrs[0] === element) {
                            tureflase[0] = true;
                            return; 
                        }   
                    });
                    insults.forEach(element => {
                        if(agrs[1] === element) {
                            tureflase[1] = true;
                            return;
                        }
                    });
                    
                    if(agrs.length === 2  && tureflase[0] && tureflase[1]){
                        collector.stop();
                        return true;
                    } else m.channel.send(m.content);
                })
                collector.on("end", m =>message.channel.send("lol"));
                return true;
            break;
        }
    },
        

};
