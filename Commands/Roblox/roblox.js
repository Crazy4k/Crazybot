const makeEmbed = require('../../functions/embed');
const checkRoles = require("../../functions/Response based Checkers/checkRoles");
const mongo = require("../../mongo");
let {guildsCache} = require("../../caches/botCache");
const serversSchema = require("../../schemas/servers-schema");
const Command = require("../../Classes/Command");
const {MessageActionRow, MessageButton} = require("discord.js");


const type0Message = "(type `0` to cancel / type \"`no`\" for none)\n"; 
const idleMessage = "Command cancelled due to the user being idle";
const cancerCultureMessage = "Command cancelled successfully";
let roblox = new Command("roblox");
roblox.set({
	aliases         : [],
	description     : "modifies the roblox related settings of the server",
	usage           : "roblox [option]",
	cooldown        : 5,
	unique          : true,
	category        : "roblox",
	whiteList       : "ADMINISTRATOR",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    options			: [
        {
            name : "option",
            description : "Which of the following options do you want to modify",
            choices: [
                {name: "Force Roblox usernames as nicknames", value: "forceRobloxNames"},
                {name: "Roblox Verified role", value: "verifiedRole"},
                //{name: "Update new people upon joining server", value: "autoupdate"}
                
            ],
            required : false,
            type: 3,
		},
		

	],
});

roblox.execute = function(message, args, server, isSlash) {

    let author;
    let type = args[0];
    if(isSlash){
        author = message.user;
        if(args[0])type = args[0].value;
        
    }
    else author = message.author;

    const yes = new MessageButton()
    .setCustomId('true')
    .setLabel('Yes')
    .setStyle('SUCCESS');
    const no = new MessageButton()
    .setCustomId('false')
    .setLabel('No')
    .setStyle('DANGER');
    let row = new MessageActionRow().addComponents(yes, no);

const messageFilter = m => !m.author.bot && m.author.id === author.id;
const buttonFilter =  noob => noob.user.id === author.id && !noob.user.bot;

try {        
    
    if(!args.length){
        const embed = makeEmbed("Roblox settings", `Your Roblox-to-Discord configuration look like this:`, server);

        if(server.verifiedRole){
            embed.addField('Verified role', `Role: <@&${server.verifiedRole}>\n\nChange value:\n\`${server.prefix}${this.name} role\``, true);
        }else {
            embed.addField('Verified role', `Empty\n\nChange value:\n\`${server.prefix}${this.name} role\``, true);
        }
        
        embed.addField('Roblox usernames as Discord nicknames?', `Value: ${server.forceRobloxNames? "✅": "❌"}\n\nChange value:\n\`${server.prefix}${this.name} nicknames\``, true);
       // embed.addField('Automatically update new members', `Value: ${server.autoupdate? "✅": "❌"}\n\nChange value:\n\`${server.prefix}${this.name} autoupdate\``, true);
        
        message.reply({embeds:[embed]});
        return false;

    } else {
        let daServer = server;
        switch (type.toLowerCase()) {
            
            case "verifiedrole":
            case "role":
            case "verify":
            case "verifiedrole":
                let embedo1 = makeEmbed("Roblox server Settings", `${type0Message}**Enter  your verified role.**`, server);
                message.reply({embeds: [embedo1]})
                    .then(m => {
                        message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                            .then(async a => {     
                                let toCheck = checkRoles(a);
                                switch (toCheck) {
                                    case "not valid":
                                    case "no args": 
                                    case "not useable":              
                                        message.channel.send("Invalid argument, command failed.");
                                        return false;
                                        break;
                                    case "cancel":
                                        message.channel.send(cancerCultureMessage);
                                        return false;
                                        break;
                                    case "no":
                                        daServer.verifiedRole = "";
                                        break;
                                    default:
                                        daServer.verifiedRole = toCheck;
                                        break;
                                }
                                await mongo().then(async (mongoose) =>{
                                    try{ 
                                        await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                            verifiedRole: daServer.verifiedRole,
                                        },{upsert:false});
                                        message.channel.send(`\n**Roblox verifed role has been successfully updated ✅.**`)
                                        guildsCache[message.guild.id] = daServer;
                                    } finally{
                                        console.log("WROTE TO DATABASE");
                                        mongoose.connection.close();
                                    }
                                });
                            }).catch(e => {
                                message.channel.send(idleMessage);
                            });;
                    });
                    return true;
                break;
               
            case "forcerobloxnames":
            case "nicknames":
            case "names":
                let embedo7 = makeEmbed("Roblox server Settings", `**Do you want Roblox usernames to be nicknames in this discord?**\nThis will change the nickname of everyone in this server.`, server);
                message.reply({embeds:[embedo7], components: [row]})
                .then(async m => {
                    let replyMessage;
                    if(isSlash)replyMessage = await  message.fetchReply();
                    else replyMessage = m;
                    
                    replyMessage.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 30, errors : ["time"] })
                        .then(async a =>{
                            
                            switch (a.customId) {
                                case "true":
                                    daServer.forceRobloxNames = true;
                                    a.update({components:[]});
                                    break;
                                case "false":
                                    daServer.forceRobloxNames = false;
                                    a.update({components:[]});
                                    break;
                                default:
                                    message.channel.send(cancerCultureMessage);
                                    a.update({components:[]});
                                    return false;
                                    break;
                            }
                            await mongo().then(async (mongoose) =>{
                                try{ 
                                    await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                        forceRobloxNames: daServer.forceRobloxNames,
                                    },{upsert:false});
                                    message.channel.send(`**Boolean status has been successfully updated ✅.**`)
                                    guildsCache[message.guild.id] = daServer;
                                } finally{
                                    console.log("WROTE TO DATABASE");
                                    mongoose.connection.close();
                                }
                            });
                        }).catch(e => {
                            if(isSlash) message.editReply({components:[]});
                            else newMsg.edit({components:[]});
                            message.channel.send(idleMessage);
                        });
                    });
                    return true;
                break;   
          /*  case "autoupdate":
            case "update":
                let embed = makeEmbed("Roblox server Settings", `**Do you want the bot to do the ${server.prefix}update command to newly joined members automatically?**`, server);
                message.reply({embeds:[embed], components: [row]})
                .then(async m => {
                    let replyMessage;
                    if(isSlash)replyMessage = await  message.fetchReply();
                    else replyMessage = m;
                    
                    replyMessage.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 30, errors : ["time"] })
                        .then(async a =>{
                            
                            switch (a.customId) {
                                case "true":
                                    daServer.autoupdate = true;
                                    a.update({components:[]});
                                    break;
                                case "false":
                                    daServer.autoupdate = false;
                                    a.update({components:[]});
                                    break;
                                default:
                                    message.channel.send(cancerCultureMessage);
                                    a.update({components:[]});
                                    return false;
                                    break;
                            }
                            await mongo().then(async (mongoose) =>{
                                try{ 
                                    await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                        autoupdate: daServer.autoupdate,
                                    },{upsert:false});
                                    message.channel.send(`**Boolean status has been successfully updated ✅.**`)
                                    guildsCache[message.guild.id] = daServer;
                                } finally{
                                    console.log("WROTE TO DATABASE");
                                    mongoose.connection.close();
                                }
                            });
                        }).catch(e => {
                            if(isSlash) message.editReply({components:[]});
                            else newMsg.edit({components:[]});
                            message.channel.send(idleMessage);
                        });
                    });
                    return true;
                break;  */ 
            default:
                message.channel.send("Invalid value.");
                break;
        }
        
    }
} catch (err) {console.log(err);}

}

module.exports = roblox;