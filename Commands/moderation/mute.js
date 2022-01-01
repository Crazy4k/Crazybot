
const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
let {muteCache} = require("../../caches/botCache");
const colors = require("../../config/colors.json");
const Command = require("../../Classes/Command");

let timeout = new Command("timeout");

timeout.set({
    
	aliases         : ["shut","stfu","mute"],
	description     : "Times out a specific user for a given duration.",
	usage           : "timeout <@user> <duration in s,m or h> [reason]",
	cooldown        : 4,
	unique          : false,
	category        : "Moderation",
	whiteList       : "MODERATE_MEMBERS",
    requiredPerms   : "MODERATE_MEMBERS",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    options			: [
        {
            name : "user",
            description : "The person to timeout",
            required : true,
            type: 6,
		},
        {
            name : "unit",
            description : "hours, minutes, seconds",
            choices: [ {name:"seconds",value:"s"}, {name:"minutes",value:"m"}, {name:"hours",value:"h"},{name:"days",value:"d"},],
            required : true,
            type: 3,
		},{
            name : "duration",
            description : "How long to mute the user using the previous unit?",
            required : true,
            type: 4,
		},
		{
            name : "reason",
            description : "The reason behind the timeout",
            required : true,
            type: 3,
		}
        

	],
});

timeout.execute = function(message, args, server, isSlash) {
    let author;
    let reason;
    let toCheck;
    let muteTime;
    let muteTimeString; 
    let number;
    if(isSlash){
        author = message.user;
        toCheck = args[0].value;
        reason = args[3].value;
        muteTime = muteTimeString = args[2].value + args[1].value
        number = args[2].value;
    } else{
        author = message.author;
        toCheck = checkUseres(message,args,0);
        reason = args.splice(2).join(" ");
        muteTime = muteTimeString = number = args[1]
        
    }

    if(!reason) reason = "`No reason given by " + author.id +"`";


    
        
    const modLog = message.guild.channels.cache.get(server.logs.warningLog);
    switch (toCheck) {
        case "not valid":
        case "everyone":	
        case "not useable":
            const embed = makeEmbed('invalid username',this.usage, server);
            sendAndDelete(message,embed, server);
            return false;
            break;
        case "no args": 
            const embed1 = makeEmbed('Missing arguments',this.usage, server);
            sendAndDelete(message,embed1, server);
            return false;		
            break;
        default:

            const member = message.guild.members.cache.get(toCheck);
            if(member.permissions.has(this.whiteList)){
                const embed1 = makeEmbed('Could not do this action on a server moderator',``, colors.failRed);
                sendAndDelete(message,embed1, server);
                return false;
            }
            let multiplier = 1000 ;
            if(!muteTime){
                muteTime = 30000 //default time is 30 minutes
                muteTimeString = "30 minutes";
            }

            else {   
                switch (muteTime.split("").pop().toLowerCase()) {
                    case "d":
                    case "day":
                    case "days":
                        multiplier *= 60 * 60 * 24;
                        break;
                    case "h":
                    case "hour":
                    case "hrs":
                    case "hr":
                        multiplier *= 60 * 60;
                        break;
                    case "m":
                    case "minutes":
                    case "minute":
                    case "min":
                    case "mins":
                        multiplier *= 60;
                        break;
                        case "s":
                        case "sec":
                        case "seconds":
                        case "secs":
                            break;
                    default:
                        const embed = makeEmbed('Invalid time format provided',`${this.usage}\nAdd s, m, h or d after the time`, server);
                        sendAndDelete(message,embed, server);
                        return false;
                        break;
                }
                
                
                muteTime = parseInt(number);

                if(isNaN(parseInt(number))){
                    const embed = makeEmbed('Invalid time was provided',this.usage+'\nA valid format looks like this: "60s", "5m", "10h"', server);
                    sendAndDelete(message,embed, server);
                    return false;
                }
                if(muteTime * multiplier > 2419200000){
                    const embed = makeEmbed('Maximum time reached',"Cannot timeout a user for more than 28 days", server);
                    sendAndDelete(message,embed, server);
                    return false;
                }
                if(muteTime * multiplier < 1000){
                    const embed = makeEmbed('Invalid duration',"Timeout duration must be at least 1 second", server);
                    sendAndDelete(message,embed, server);
                    return false;
                }
            }

            if(member.moderatable){   
            
                member.timeout(muteTime * multiplier,reason)
                .then(e=> {

                    const embed1 = makeEmbed("Done!",`The user <@${toCheck}> has been timed out for ${muteTimeString} for \`${reason}\`` , colors.successGreen);
                    message.reply({embeds:[embed1]});
                    
                    const logEmbed = makeEmbed("Mute",`The user <@${author.id}> (${author.id}) has timed out the user <@${toCheck}> (${toCheck}) for ${muteTimeString} with the reason: ${reason}`,"002EFE",true);
                    
                    logEmbed.setAuthor({name: message.guild.members.cache.get(toCheck).user.tag ,iconURL: message.guild.members.cache.get(toCheck).user.displayAvatarURL()});
                    
                    if(modLog)modLog.send({embeds:[logEmbed]});

                }).catch(e=>{
                    const embed1 = makeEmbed('Missing Permíssion',"Couldn't mute that user because the bot can't perform that action on them", server);
                    sendAndDelete(message,embed1, server);
                    return false;
                });
                                
        } else {
            const embed1 = makeEmbed('Missing Permíssion',"Couldn't mute that user because the bot can't perform that action on them", server);
            sendAndDelete(message,embed1, server);
            return false;	
        }
                
    }
    
    
}
module.exports = timeout;