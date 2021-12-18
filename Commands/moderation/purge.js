
const makeEmbed = require('../../functions/embed');
const sendAndDelete = require("../../functions/sendAndDelete");
const Command = require("../../Classes/Command");
const colors = require("../../config/colors.json");

let purge = new Command("purge");

purge.set({
    
	aliases         : ["bulkdelete","clear"],
	description     : "Deletes the given messages that are **newer than two weeks**.",
	usage           : "purge <amount of messages to delete> \n\n**Message must not be older than 14 days!**",
	cooldown        : 3,
	unique          : false,
	category        : "Moderation",
	whiteList       : "MANAGE_MESSAGES",
	requiredPerms   : "MANAGE_MESSAGES",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    options			: [
        {
            name : "amount",
            description : "The amount of new message to delete (max = 100)",
            required : true,
            type: 4,
		},
		
	],
});

purge.execute = function(message, args, server,isSlash) {

    const modLog = message.guild.channels.cache.get(server.logs.warningLog);
    let author;
    let number;
    if(isSlash){
        author = message.user;
        number = args[0].value;
    } else{
        author = message.author;
        number = parseInt(args[0]);
    }


    if(isNaN(number)){
        const embed = makeEmbed('invalid number',this.usage, server);
        sendAndDelete(message,embed, server);
        return false;
    } else if(number <= 0){
        const embed = makeEmbed('invalid number',"Number must be more than 0", server);
        sendAndDelete(message,embed, server);
        return fals
    } else if( number > 100){
        const embed = makeEmbed('invalid number',"Number must be below 100", server);
        sendAndDelete(message,embed, server);
        return false;
    } else{ 
        
        message.channel.bulkDelete(number, true)
        .then(m=>{
            if(isSlash){
                sendAndDelete(message, "Done! ✅", server);
            } else{
                message.channel.send(`Done! ✅`)
                .then(msg=> setTimeout(() => {
                    msg.delete().catch(e=>e);
                }, 4000))
            }
            const logEmbed = makeEmbed("Message purge",`The user <@${author.id}>[${author.id}] has purged ${number} message from <#${message.channel.id}> `,"ff7f00",true);
            if(modLog)modLog.send({embeds:[logEmbed]});
        })

        .catch(console.error);
        return true;
    }
}
module.exports = purge;