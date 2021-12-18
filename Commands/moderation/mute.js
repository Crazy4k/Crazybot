
const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
let {muteCache} = require("../../caches/botCache");
const colors = require("../../config/colors.json");
const Command = require("../../Classes/Command");

let mute = new Command("mute");

mute.set({
    
	aliases         : ["shut","stfu"],
	description     : "Mutes someone for a specific duration",
	usage           : "mute <@user> <duration in s,m or h>",
	cooldown        : 3,
	unique          : false,
	category        : "Moderation",
	whiteList       : "MUTE_MEMBERS",
    requiredPerms   : "MANAGE_ROLES",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    options			: [
        {
            name : "user",
            description : "The person to mute",
            required : true,
            type: 6,
		},
        {
            name : "time",
            description : "hours, minutes, seconds",
            choices: [ {name:"seconds",value:"s"}, {name:"minutes",value:"m"}, {name:"hours",value:"h"},],
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
            description : "The reason behind the mute",
            required : true,
            type: 3,
		}
        

	],
});

mute.execute = function(message, args, server, isSlash) {
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

    if(!reason) reason = "`No reason given`";


    try {
        const muteRole = message.guild.roles.cache.get(server.muteRole);
        
        
    
        if(!muteRole){
            const embed1 = makeEmbed("Couldn't mute","It appears that you don't have a mute role configured\nDo `"+server.prefix+"server` to configure your server roles.", server);
            sendAndDelete(message,embed1, server);
            return false;
        }
        const muteLog = message.guild.channels.cache.get(server.logs.warningLog);
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
                let multi = 1000 * 60;
                if(!muteTime){
                    muteTime = 30 //default time is 30 minutes
                    muteTimeString = "30 minutes";
                }
                else {   
                    if(muteTime.endsWith("h")) multi *= 60;
                    else if(muteTime.endsWith("m"));
                    else if(muteTime.endsWith("s"))multi /=60;
                    else{
                        const embed = makeEmbed('Invalid time format provided',`${this.usage}\nAdd h,m or s after the time`, server);
                        sendAndDelete(message,embed, server);
                        return false;
                    }  
                    muteTime = parseInt(number);
                    if(isNaN(parseInt(number))){
                        const embed = makeEmbed('Invalid time was provided',this.usage+'\nA valid format looks like this: "60s", "5m", "10h"', server);
                        sendAndDelete(message,embed, server);
                        return false;
                    }
                }
                
                let hisRoles = [];
                if(member.roles.cache.size){
                    member.roles.cache.each(rolee=>{
                    
                        if(rolee.id !== message.guild.id && !rolee.managed && rolee.id !== muteRole.id)hisRoles.push(rolee.id);
                        
                    })
                    hisRoles.reverse();
                }    
                
                if(muteCache[`${author.id}-${message.guild.id}`]){
                    const embed = makeEmbed('User already muted',`That user is already muted. Instead, try using ${server.prefix}unmute`, server);
                    sendAndDelete(message,embed, server);
                    return false;
                }
                
                
                if(member.manageable){
                    
                    
                    member.roles.remove(hisRoles, "mute").then(e=> {
                        if(muteRole){
                            member.roles.add(muteRole.id).then(role=>{

                                const embed1 = makeEmbed("Done!",`The user <@${toCheck}> has been muted for ${muteTimeString} for \`${reason}\`` , colors.successGreen);
                                message.reply({embeds:[embed1]});
                                muteCache[`${author.id}-${message.guild.id}`] = hisRoles;
                                setTimeout(()=>{
                                    try{
                                        if(muteCache[`${author.id}-${message.guild.id}`] !== null){
                                        if(hisRoles.length){
                                            if(member.roles.cache.get(muteRole.id)){
                                                member.roles.add(hisRoles).then(e=>{
                                                    member.roles.remove(muteRole.id).catch(e=>console.log(e));
                                                }).catch(e=>console.log(e));
                                            }
                                            
                                        } else if(member.roles.cache.get(muteRole.id))member.roles.remove(muteRole.id).catch(e=>console.log(e));
    
                                        message.channel.send(`<@${member.id}> has been unmuted for: expired mute`)
                                        muteCache[`${author.id}-${message.guild.id}`] = null;
                                    }}catch(e){
                                        console.log(e)
                                    }
                                },muteTime * multi);
                                const logEmbed = makeEmbed("Mute","","002EFE",true);
                                logEmbed.setAuthor(message.guild.members.cache.get(toCheck).user.tag, message.guild.members.cache.get(toCheck).user.displayAvatarURL());
                                logEmbed.addFields(
                                    { name:'Duration', value:muteTimeString, inline:true },
                                    { name:'Muted:', value:`<@${toCheck}>`, inline:true },
                                    { name:'Muted by: ', value:`<@${author.id}>`, inline:true },
                                    { name:'Roles:', value:`<@&${hisRoles.join("> <@&")}>`, inline:true },
                                    { name : "Reason:", value:reason, inline:true}
                                
                                );
                                if(muteLog)muteLog.send({embeds:[logEmbed]});

                            }).catch(e=>{   
                                const embed1 = makeEmbed('Missing Permíssion',"Couldn't mute that user because the mute role isn't accessable!\nTry putting the mute role under the bot's role", server);
                                sendAndDelete(message,embed1, server);
                                return false;
                            });
                            
                        }else{
                            const embed1 = makeEmbed('Missing Permíssion',"Missing mute role!, use the `;server` command to setup a new mute role.", server);
                            sendAndDelete(message,embed1, server);
                            return false;	
                        }
                    }).catch(e=>{
                        console.log(e);
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
    } catch (error) {
        console.log("MUTE COMMAND ERRO");
        console.log(error);
    }

    
    
}
module.exports = mute;