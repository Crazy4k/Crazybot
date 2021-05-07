const makeEmbed = require('../../functions/embed');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../../config.json");
const checkUseres = require("../../functions/checkUser");
const im = ["i'm","im","i am", "i m", "Im", "I'm", "I am"];
const insults = ["ugly","fat","dumb", "noob"];

module.exports = {
	name : 'copy',
	description : 'Makes the bot copy every message that the <user> says',
	usage:'!copy <user>',
	whiteList : ['ADMINISTRATOR'],

	execute(message, args, server ) {

        switch (checkUseres(message, args, 0)) {
            case "not valid":
            case "everyone":	
            case "not useable":
                try {
        
                    const embed = makeEmbed('invalid username',this.usage);
            
                    message.channel.send(embed)
                        .then(msg => msg.delete({ timeout : failedEmbedTO }))
                        .catch(console.error);
                    return message.delete({ timeout: faliedCommandTO });
            
                } catch (error) {
                    console.error(error);
                }
                break;
            case "no args": 
                const embed = makeEmbed('Missing arguments',this.usage);
                message.channel.send(embed)
                    .then(msg => msg.delete({ timeout : failedEmbedTO }))
                    .catch(console.error);
                return message.delete({ timeout: faliedCommandTO });                
            default:
                message.channel.send("ok");
                const number = checkUseres(message, args, 0);
                const filter = m => !m.author.bot && m.author.id === number;
		        const collector = message.channel.createMessageCollector(filter,{time:150000});
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
                        return;
                    } else m.channel.send(m.content);
                })
                collector.on("end", m =>message.channel.send("lol"));
            break;
        }
    },
        

};
