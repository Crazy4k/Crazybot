const makeEmbed = require('../functions/embed');
const {faliedCommandTO ,failedEmbedTO, deleteFailedMessaged} = require("../config.json");
const checkUseres = require("../functions/checkUser");

module.exports = {
	name : 'copy',
	description : 'Makes the bot copy every message that the <user> says',
	usage:'!copy <user>',
	whiteList : ['ADMINISTRATOR'],

	execute(message, args) {

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
                        break;
                
            default:

                const number =checkUseres(message, args, 0);
                const filter = m => !m.author.bot && m.author.id === number;/*.author.id === checkUseres(message, args, 0);*/
		        const collector = message.channel.createMessageCollector(filter,{time:150000});
                collector.on("collect", m => m.channel.send(m.content));
                collector.on("end", m =>message.channel.send("lol"));
                break;
        }
        

	},
};