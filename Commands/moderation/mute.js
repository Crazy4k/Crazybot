
const makeEmbed = require('../../functions/embed');
const checkUseres = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const client = require("../../index");


module.exports = {
	name : 'mute',
	aliases: ["shut"],
	description : 'mutes someone for a specific duration',
	cooldown: 1,
	usage:'!mute <@user> [duration in s,m or h]',
	whiteList:'MUTE_MEMBERS',
	execute(message, args, server) {

        const muteRole = message.guild.roles.cache.get(server.muteRole);
        if(!muteRole){
            const embed1 = makeEmbed("Couldn't mute","It appears that you don't have a mute role configured\nDo !server to configure your server roles.", server);
			sendAndDelete(message,embed1, server);
			return false;
        }

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
                if(isNaN(muteTime)){
                    const embed = makeEmbed('Invalid time was provided',this.usage, server);
				    sendAndDelete(message,embed, server);
				    return false;
                }
                let hisRoles = [];
                for(let rolee of member.roles.cache){
                    if(rolee[1].id !== member.guild.id)hisRoles.push(rolee[1].id);
                }
                hisRoles.reverse();
                	member.roles.remove(member.roles.cache, "mute").then(e=> {
                        member.roles.add(muteRole.id);
                        const embed1 = makeEmbed("Done!",`The user <@${toCheck}> has been muted for ${args[1]}`, server);
                        message.channel.send(embed1);
                        client.setTimeout(()=>{
                            member.roles.add(hisRoles);
                            member.roles.remove(muteRole.id);

                        },muteTime * multi);
                        }).catch(e=> console.log(e));
                	
        }
		
	},

};
