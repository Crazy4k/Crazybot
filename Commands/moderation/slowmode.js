const makeEmbed = require('../../functions/embed.js');
const checkChannels = require("../../functions/checkChannels");
const sendAndDelete = require("../../functions/sendAndDelete");
const colors = require("../../colors.json");
const Command = require("../../Classes/Command");

let slowmode = new Command("slowmode");

slowmode.set({
    
	aliases         : ["sm","slowm","chatcooldow"],
	description     : "Changes the slowmode duration of a channel",
	usage           : "Slowmode <seconds> [#channel or id]",
	cooldown        : 5,
	unique          : false,
	category        : "Moderation",
	whiteList       : "MANAGE_CHANNELS",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : false
});


slowmode.execute = function(message, args, server) {

    if(!args[0]){
        message.channel.send(`The current Slowmode is ${message.channel.rateLimitPerUser}.`);
        return false;
    }
    const modLog = message.guild.channels.cache.get(server.logs.warningLog);
    let id = checkChannels(message,args,1);
    switch (id) {
        case "not valid":
        case "everyone":	
        case "not useable":
            const embed1 = makeEmbed('invalid username',this.usage, server);
            sendAndDelete(message,embed1, server );
            return false;	
            break;
        case "no args": 
            id = message.channel.id;
            
        default:

            const target = message.guild.channels.cache.get(id);
            
            const time = parseInt(args[0]);
            if(isNaN(time)){
                const embed = makeEmbed("Command failed", `First argument must be a number!`,server);
                sendAndDelete(message,embed,server);
                return false;
            }
            if(time > 21600){
                const embed = makeEmbed("Command failed", `Slowmode cannot go above 6 hours!`,server);
                sendAndDelete(message,embed,server);
                return false;
            }
            try {
                let before = message.channel.rateLimitPerUser;
                target.edit({rateLimitPerUser: time}).then(e=>{

                    message.channel.send(`Changed the slowmode of <#${target.id}> to ${time} seconds successfully.`)

                    const logEmbed = makeEmbed("Slowmode","",colors.changeBlue,true);
                    logEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                    logEmbed.addFields(
                        { name: 'Changes: ', value: `Changed slowmode from ${before} to ${message.channel.rateLimitPerUser}`, inline:false },
                        { name: 'Changed by: ', value: `<@${message.author.id}>-${message.author.id}`, inline:false },
                        { name : "Changed in: ", value: `<#${message.channel.id}>-${message.channel.id}`, inline:false}
                    );
                    if(modLog)modLog.send({embeds:[logEmbed]});
                })

                return true;
            } catch (error) {
                const embed = makeEmbed("Command failed", `And error accoured and could not execute this command.`,server);
                sendAndDelete(message,embed,server);
                console.log(error);
                return false;
                
            }





    }
}

module.exports = slowmode;