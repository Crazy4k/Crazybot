const makeEmbed = require('../../functions/embed.js');
const checkChannels = require("../../functions/checkChannels");
const sendAndDelete = require("../../functions/sendAndDelete");
const colors = require("../../config/colors.json");
const Command = require("../../Classes/Command");

let slowmode = new Command("slowmode");

slowmode.set({
    
	aliases         : ["sm","slowm","chatcooldow"],
	description     : "Changes the slowmode duration of a channel",
	usage           : "Slowmode <seconds>",
	cooldown        : 5,
	unique          : false,
	category        : "Moderation",
	whiteList       : null,
    requiredPerms   : "MANAGE_CHANNELS",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    options			: [
        {
            name : "seconds",
            description : "For mods: change the slowmode to a new number between 1 sec to 6 hours",
            required : false,
            type: 4,
		}

	],
});


slowmode.execute = async function(message, args, server, isSlash) {
    let author;
    let newTime;
    if(isSlash){
        author = message.user;
        if(args[0])newTime = args[0].value;
    } else{
        author = message.author;
        newTime = args[0];
    }

    if(!newTime){
        message.reply(`The current Slowmode is ${message.channel.rateLimitPerUser} seconds.`);
        return false;
    }
    const dude = await message.guild.members.cache.get(author.id);
    if(dude.permissions.has("MANAGE_MESSAGES")) {
        const modLog = message.guild.channels.cache.get(server.logs.warningLog);
   

        
        const time = parseInt(newTime);
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
            message.channel.edit({rateLimitPerUser: time}).then(e=>{

                message.reply(`Changed the slowmode to ${time} seconds successfully ✅.`)

                const logEmbed = makeEmbed("Slowmode",`<@${author.id}> (${author.id}) has just changed the slowmode of <#${message.channel.id}> (${message.channel.id}) from ${before} to ${message.channel.rateLimitPerUser}`,colors.changeBlue,true);
                logEmbed.setAuthor({name: author.tag, iconURL : author.displayAvatarURL()});
                if(modLog)modLog.send({embeds:[logEmbed]});
            })

            return true;
        } catch (error) {
            const embed = makeEmbed("Command failed", `And error accoured and could not execute this command.`,server);
            sendAndDelete(message,embed,server);
            console.log(error);
            return false;
            
        }
    } else{
        const embed = makeEmbed("Missing permission",`You don't have the required permission to run this command`,"FF0000",);
        sendAndDelete(message,embed,server);
        return false;
    }


    
}

module.exports = slowmode;