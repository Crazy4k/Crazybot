
const makeEmbed = require('../../functions/embed');
const sendAndDelete = require("../../functions/sendAndDelete");
const Command = require("../../Classes/Command");

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
	isSlashCommand  : false
});

purge.execute = function(message, args, server) {

    let number = parseInt(args[0]);
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
            message.channel.send(`Done! ✅`)
            .then(msg=> setTimeout(() => {
                msg.delete().catch(e=>e);
            }, 4000))
        })
        .catch(console.error);
        return true;
    }
}
module.exports = purge;