
const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const client = require("../../index");
let muteCache = require("../../caches/muteCache");


module.exports = {
	name : 'mute',
	aliases: ["shut","stfu"],
	description : 'mutes someone for a specific duration',
	cooldown: 1,
	usage:'!mute <@user> [duration in s,m or h]',
	whiteList:'MUTE_MEMBERS',
	execute(message, args, server) {

        const muteRole = message.guild.roles.cache.get(server.muteRole);
        let reason = args.splice(2).join(" ");
		if(!reason) reason = "`No reason given`";

        if(!muteRole){
            const embed1 = makeEmbed("Couldn't mute","It appears that you don't have a mute role configured\nDo !server to configure your server roles.", server);
			sendAndDelete(message,embed1, server);
			return false;
        }
        const muteLog = message.guild.channels.cache.get(server.logs.warningLog);
        let toCheck =checkUseres(message,args,0);
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

                let muteTime = args[1];
                const member = message.guild.members.cache.get(toCheck);
                let multi = 1000 * 60;
                if(!muteTime){
                    const embed = makeEmbed('Missing argument',this.usage, server);
				    sendAndDelete(message,embed, server);
				    return false;
                }
                if(muteTime.endsWith("h")) multi *= 60;
                else if(muteTime.endsWith("m"));
                else if(muteTime.endsWith("s"))multi /=60;
                else{
                    const embed = makeEmbed('Invalid time format provided',`${this.usage}\nAdd h,m or s after the time`, server);
				    sendAndDelete(message,embed, server);
				    return false;
                }  
                muteTime = parseInt(args[1]);
                if(isNaN(parseInt(args[1]))){
                    const embed = makeEmbed('Invalid time was provided',this.usage+'\nA valid format looks like this: "60s", "5m", "10h"', server);
				    sendAndDelete(message,embed, server);
				    return false;
                }
                let hisRoles = [];
                for(let rolee of member.roles.cache){
                    if(rolee[1].id !== member.guild.id)hisRoles.push(rolee[1].id);
                }
                hisRoles.reverse();
                muteCache[`${message.author.id}-${message.guild.id}`] = hisRoles;
                
                if(member.manageable){
                    try {
                    member.roles.remove(member.roles.cache, "mute").then(e=> {
                        member.roles.add(muteRole.id);
                        const embed1 = makeEmbed("Done!",`The user <@${toCheck}> has been muted for ${args[1]} for \`${reason}\`` , server);
                        message.channel.send(embed1);
                        client.setTimeout(()=>{
                            if(muteCache[`${message.author.id}-${message.guild.id}`] !== null){
                                member.roles.add(hisRoles);
                                member.roles.remove(muteRole.id);
                                muteCache[`${message.author.id}-${message.guild.id}`] = null;
                            }
                        },muteTime * multi);
                        const logEmbed = makeEmbed("Mute","","002EFE",true);
                        logEmbed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                        logEmbed.addFields(
                            { name:'Duration', value:args[1], inline:true },
                            { name:'Muted by: ', value:message.author, inline:true },
                            { name:'Roles: ', value:hisRoles.join("> <@"), inline:true },
                            { name : "Reason:", value:reason, inline:true}
						
                        );
                        if(muteLog)muteLog.send(logEmbed);
                    }).catch(e=>{
                        console.log(e);
                        const embed1 = makeEmbed('Missing Permíssion',"Couldn't mute that user because the bot can't perform that action on them", server);
			            sendAndDelete(message,embed1, server);
			            return false;
                    });
                }catch (error) {
                    const embed1 = makeEmbed('Missing Permíssion',"Couldn't mute that user because the bot can't perform that action on them", server);
                    sendAndDelete(message,embed1, server);
                    return false;	
                }
            } else {
                const embed1 = makeEmbed('Missing Permíssion',"Couldn't mute that user because the bot can't perform that action on them", server);
                sendAndDelete(message,embed1, server);
                return false;	
            }
                   	
        }
		
	},

};
