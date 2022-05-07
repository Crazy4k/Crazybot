const makeEmbed = require('../../functions/embed');
const type0Message = "(type `0` to cancel / type \"`no`\" for none)\n"; 
const idleMessage = "Command cancelled due to the user being idle";
const cancerCultureMessage = "Command cancelled successfully";
const checkChannels = require("../../functions/Response based Checkers/checkChannels");
const checkRoles = require("../../functions/Response based Checkers/checkRoles");
const mongo = require("../../mongo");
let {guildsCache} = require("../../caches/botCache");
const serversSchema = require("../../schemas/servers-schema");
const sendAndDelete = require("../../functions/sendAndDelete");
const Command = require("../../Classes/Command");
const {MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");

let panel = new Command("panel");

panel.set({
	aliases         : [],
	description     : "modifies the settings of the server",
	usage           : "panel",
	cooldown        : 5,
	unique          : true,
	category        : "config",
	whiteList       : "ADMINISTRATOR",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
});

panel.execute = async function(message, args, server, isSlash) {

    let author;
    let type = args[0];
    if(isSlash){
        author = message.user;
        if(args[0])type = args[0].value;
        
    }
    else author = message.author;

    const serverMenu = new MessageSelectMenu()
    .setCustomId("server-menu")
    .setOptions(
        {label: "Welcome channel", value: "hiByeChannel", default: false},
        {label: "Welcome role", value: "hiRole", default: false},
        {label: "Delete message in logs", value: "deleteMessagesInLogs", default: false},
        {label: "Delete failed commands", value: "deleteFailedCommands", default: false},
        {label: "Ignore default required permission for slash commands", value:"overWriteDefaultPermission", default: false},
        {label: "Slash commands only", value:"onlySlash", default: false},
        {label: "Prefix", value: "prefix", default: false},
        {label: "Default embed color", value: "defaultEmbedColor", default: false},
        {label: "Disabled command categories", value: "disabledCategories", default: false},
    );

    const logsMenu = new MessageSelectMenu()
    .setCustomId("logs-menu")
    .setOptions(
        {label: "Member logs", value: "hiByeLog", default: false},
        {label: "Messages logs", value: "deleteLog", default: false},
        {label: "Server logs", value: "serverLog", default: false},
        {label: "Moderation logs", value: "warningLog", default: false},
        {label: "Points logs", value: "pointsLog", default: false},
        {label: "Events logs", value: "eventsLog", default: false},
    );

    const robloxMenu = new MessageSelectMenu()
    .setCustomId("roblox-menu")
    .setOptions(
        {label: "Verified role", value: "verifiedRole", default: false},
        {label: "Roblox usernames as Discord nicknames", value: "forceRobloxNames", default: false},
    )

    const configRow = new MessageActionRow().setComponents(serverMenu);
    
    const serverButton = new MessageButton()
    .setCustomId("server-button")
    .setStyle("PRIMARY")
    .setLabel("Server")
    .setDisabled(true)
    const logsButton= new MessageButton()
    .setCustomId("logs-button")
    .setStyle("PRIMARY")
    .setLabel("Logs")
    .setDisabled(false)
    const robloxButton= new MessageButton()
    .setCustomId("roblox-button")
    .setStyle("PRIMARY")
    .setLabel("Roblox")
    .setDisabled(false);

    const navigationRow = new MessageActionRow().addComponents(serverButton, logsButton, robloxButton);
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
        const disabledCategories = [];

        for(let i in server.disabledCategories){
           if(server.disabledCategories[i])disabledCategories.push(i);
        }


       const embed = makeEmbed("Control panel", "Every available setting is listed below", server);
       
       embed.addFields(
            {name:"\u200b",value:"**Server configurations**", inline: false},
            {name:"Welcome channel 👋", value:`${server.hiByeChannel ? "<#"+server.hiByeChannel+">" : "empty"}`, inline: true},
            {name:"Welcome role 👋", value:`${server.hiRole ? "<@&"+server.hiRole+">" : "empty"}`, inline: true},
            {name:'Delete messages in logs? ❌', value:`${server.deleteMessagesInLogs? "✅" : "❌"}`, inline:true},
            {name:'Delete failed commands? 🕐', value:`${server.deleteFailedCommands ? "✅" : "❌"}`, inline:true},
            {name:'Ignore default required permission for slash commands?', value:`${server.overWriteDefaultPermission? "✅" : "❌"}`, inline:true},
            {name:'Slash commands only', value:`${server.onlySlash? "✅" : "❌"}`, inline:true},
            {name:'Prefix ℹ', value:`${server.prefix}`, inline:true},
            {name:'Default embed color 🎨', value:`${server.defaultEmbedColor}`, inline:true},
            {name:"Disabled command categories", value:`${disabledCategories.length ? disabledCategories.join(", ") : "-" }`, inline : true}
        );

        

        let newMsg =  await message.reply({embeds:[embed], components: [navigationRow, configRow]});
        
        const collector = newMsg.createMessageComponentCollector({ filter: buttonFilter, time: 30 * 1000 });

        collector.on('collect', async i => {
            collector.resetTimer();
            switch (i.customId){
                case "server-button":

                    serverButton.setDisabled(true);
                    logsButton.setDisabled(false);
                    robloxButton.setDisabled(false);

                    embed.setFields(
                        {name:"\u200b",value:"**Server configurations**", inline: false},
                        {name:"Welcome channel 👋", value:`${server.hiByeChannel ? "<#"+server.hiByeChannel+">" : "empty"}`, inline: true},
                        {name:"Welcome role 👋", value:`${server.hiRole ? "<@&"+server.hiRole+">" : "empty"}`, inline: true},
                        {name:'Delete messages in logs? ❌', value:`${server.deleteMessagesInLogs? "✅" : "❌"}`, inline:true},
                        {name:'Delete failed commands? 🕐', value:`${server.deleteFailedCommands ? "✅" : "❌"}`, inline:true},
                        {name:'Ignore default required permission for slash commands?', value:`${server.overWriteDefaultPermission? "✅" : "❌"}`, inline:true},
                        {name:'Slash commands only', value:`${server.onlySlash? "✅" : "❌"}`, inline:true},
                        {name:'Prefix ℹ', value:`${server.prefix}`, inline:true},
                        {name:'Default embed color 🎨', value:`${server.defaultEmbedColor}`, inline:true},
                        {name:"Disabled command categories", value:`${disabledCategories.length ? disabledCategories.join(", ") : "-" }`, inline : true}
                    )
                    configRow.setComponents(serverMenu);
                    i.update({embeds:[embed], components: [navigationRow, configRow]});
                    break;

                case "logs-button":

                    serverButton.setDisabled(false);
                    logsButton.setDisabled(true);
                    robloxButton.setDisabled(false);

                    embed.setFields(
                        {name:"\u200b",value:"**Logging channels**", inline: false},
                        {name: "Member logs 👤", value:`${ server.logs.hiByeLog ? "<#" +server.logs.hiByeLog +">" : "Empty"}`, inline: true},
                        {name: "Messages logs 📫", value:`${ server.logs.deleteLog ? "<#" +server.logs.deleteLog +">" : "Empty"}`, inline: true},
                        {name: "Server logs 🏠", value:`${ server.logs.serverLog ? "<#" +server.logs.serverLog +">" : "Empty"}`, inline: true},
                        {name: "Moderation logs 🔨", value:`${ server.logs.warningLog ? "<#" +server.logs.warningLog +">" : "Empty"}`, inline: true},
                        {name: "Points logs 📈", value:`${ server.logs.pointsLog ? "<#" +server.logs.pointsLog +">" : "Empty"}`, inline: true},
                        {name: "Events logs 📢", value:`${ server.logs.eventsLog ? "<#" +server.logs.eventsLog +">" : "Empty"}`, inline: true}
                    )
                    configRow.setComponents(logsMenu);
                    i.update({embeds:[embed], components: [navigationRow, configRow]});
                    break;

                case "roblox-button":

                    serverButton.setDisabled(false);
                    logsButton.setDisabled(false);
                    robloxButton.setDisabled(true);

                    embed.setFields(
                        {name:"\u200b",value:"**Roblox configurations**", inline: false},
                        {name: "Verified role", value:`${server.verifiedRole ? "<@&"+server.verifiedRole+">" : "empty"}`, inline: true},
                        {name: "Roblox usernames as Discord nicknames?", value:`${server.forceRobloxNames? "✅": "❌"}`, inline: true}
                    )
                    configRow.setComponents(robloxMenu);
                    i.update({embeds:[embed], components: [navigationRow, configRow]});
                    break;
                default:
                    let daServer = server;
                    collector.stop();
                    switch (i.values[0]) {
                        case "welcomechannel":
                        case "hiByeChannel":
                            let embedo = makeEmbed("Server Settings", `${type0Message}**Enter  your welcoming channel.👋**`, server);
                            message.reply({embeds: [embedo]})
                                .then(m => {
                                    message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                        .then(async a => {   
                                            let toCheck =   checkChannels(a);
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
                                                    daServer.hiByeChannel = "";
                                                    break;
                                                default:
                                                    daServer.hiByeChannel = toCheck;
                                                    break;
                                            }
                                            await mongo().then(async (mongoose) =>{
                                                try{ 
                                                    await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                        hiByeChannel: daServer.hiByeChannel,
                                                    },{upsert:false});
                                                    message.channel.send(`**Welcome channel has been successfully updated ✅.**`)
                                                    guildsCache[message.guild.id] = daServer;
                                                } finally{
                                                    console.log("WROTE TO DATABASE");
                                                    mongoose.connection.close();
                                                }
                                            });
                                        }).catch(e => {
                                            message.channel.send(idleMessage);
                                        });
                                });
                                return true;
                            break;
                        case "welcomerole":
                        case "hiRole":
                            let embedo1 = makeEmbed("Server Settings", `${type0Message}**Enter  your welcoming role.👋**`, server);
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
                                                    daServer.hiRole = "";
                                                    break;
                                                default:
                                                    daServer.hiRole = toCheck;
                                                    break;
                                            }
                                            await mongo().then(async (mongoose) =>{
                                                try{ 
                                                    await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                        hiRole: daServer.hiRole,
                                                    },{upsert:false});
                                                    message.channel.send(`\n**Welcome role has been successfully updated ✅.**`)
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
                            case "color":
                            case "colour":
                            case "embed":
                            case "defaultEmbedColor":
                                let embedo9 = makeEmbed("Server Settings", `(type \`0\` to cancel / type "\`reset\`" to reset it to default (*#F7F7F7*)\n**Enter the hexadecimal color value you want the embeds sent by the bot to have 🎨**\nExample: #F7F7F7, #1FFA01\nUse this [Website](https://htmlcolorcodes.com) to find a hex color value quickly`, server);
                                message.reply({embeds: [embedo9]})
                                    .then(m => {
                                        message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                            .then(async a => {   
                                                let oldColor = daServer.defaultEmbedColor;
                                                let newColor = a.first().content;
                                                switch(newColor.toLowerCase()){
                                                    case "0":
                                                        message.channel.send(cancerCultureMessage);
                                                        return false;
                                                        break;
                                                    case "reset":
                                                        newColor = "#F7f7f7"
                                                        break;
            
                                                }
                                                const testEmbed = makeEmbed("Are you sure?",`This is what "${newColor}" looks like\n<\n<\n<\n<\n<\n<\n<\n Click YES to confirm\n Click NO to cancel`,newColor,false,"");
                                                message.channel.send({embeds: [testEmbed], components: [row]})
                                                .then(async m => {
            
                                                    
                                                      m.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 20, errors : ["time"] })
                                                        .then(async a =>{
                                                            
                                                            switch (a.customId) {
                                                                case "true":
                                                                    daServer.defaultEmbedColor = newColor;
                                                                    a.update({components:[]});
                                                                    break;
                                                                case "false":
                                                                    message.channel.send(cancerCultureMessage);
                                                                    a.update({components:[]});
                                                                    return false;
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
                                                                    defaultEmbedColor: newColor
                                                                },{upsert:false});
                                                                message.channel.send(`**Default embed color has been successfully updated from \`${oldColor}\` to \`${newColor}\` ✅.**`)
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
                                                })
                                              
                                                
                                            }).catch(e => {
                                                message.channel.send(idleMessage);
                                            });
                                    });
                                    return true;
                                break;      
                            case "prefix":
                                let embedo8 = makeEmbed("Server Settings", `(type \`0\` to cancel)\n**Enter your new command prefix ❗**`, server);
                                message.reply({embeds: [embedo8]})
                                    .then(m => {
                                        message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                            .then(async a => {     
                                                let oldPrefix = server.prefix;
                                                const msg = a.first().content;
                                                if (msg === "0") {
                                                    message.channel.send(cancerCultureMessage);
                                                    return false;
                                                } else if (msg.length > 7) {
                                                    const embed = makeEmbed('Prefix too long',"Command prefix can't be longer than 7 characters.", server);
                                                    sendAndDelete(message,embed, server);
                                                    return false;
                                                } else if(msg === oldPrefix) {
                                                    const embed = makeEmbed('Invalid prefix \nSame as before',"", server);
                                                    sendAndDelete(message,embed, server);
                                                    return false;
                                                }
                                                await mongo().then(async (mongoose) =>{
                                                    try{ 
                                                        await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                            prefix:msg,  
                                                        },{upsert:false});
                                                        guildsCache[message.guild.id].prefix = msg;
                                                    } finally{
                                                        console.log("WROTE TO DATABASE");
                                                        mongoose.connection.close();
                                                    }
                                    
                                                    const embed = makeEmbed(`Prefix changed from "${oldPrefix}" to "${msg}"`,'The prefix has been changed succesfuly ✅.',"2EFF00");
                                                    embed.setThumbnail('https://www.iconsdb.com/icons/preview/green/ok-xxl.png');
                
                                                    message.channel.send({embeds: [embed]});
                                                    return true;
                                                });
                                            }).catch(e => {
                                                console.log(e)
                                                message.channel.send(idleMessage);
                                            });;
                                    });
                                    return true;
                                break;
                                
                        case "deleteinlogs":
                        case "deleteMessagesInLogs":
                            let embedo6 = makeEmbed("Server Settings", `**Do you want messages to be deleted in logs?❌**`, server);
                            message.reply({embeds: [embedo6], components: [row]})
                            .then(async m => {
                                let replyMessage;
                                if(isSlash)replyMessage = await  message.fetchReply();
                                else replyMessage = m;
                                replyMessage.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 30, errors : ["time"] })
                                    .then(async a =>{
                                        
                                        switch (a.customId) {
                                            case "true":
                                                daServer.deleteMessagesInLogs = true;
                                                a.update({components:[]});
                                                break;
                                            case "false":
                                                daServer.deleteMessagesInLogs = false;
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
                                                    deleteMessagesInLogs: daServer.deleteMessagesInLogs,
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
                        case "deletefails":
                        case "deleteFailedCommands":
                            let embedo7 = makeEmbed("Server Settings", `**Do you want failed commands to be deleted after a few seconds?🕐**`, server);
                            message.reply({embeds:[embedo7], components: [row]})
                            .then(async m => {
                                let replyMessage;
                                if(isSlash)replyMessage = await  message.fetchReply();
                                else replyMessage = m;
                                
                                replyMessage.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 30, errors : ["time"] })
                                    .then(async a =>{
                                        
                                        switch (a.customId) {
                                            case "true":
                                                daServer.deleteFailedCommands = true;
                                                a.update({components:[]});
                                                break;
                                            case "false":
                                                daServer.deleteFailedCommands = false;
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
                                                    deleteFailedCommands: daServer.deleteFailedCommands,
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
                            case "categories":
                            case "disable":
                            case "commands":
                            case "enable":
                            case "disabledCategories":
                                const AdminFun = new MessageButton()
                                .setCustomId('admin fun')
                                .setLabel('Admin fun')
                                .setStyle(daServer?.disabledCategories?.["admin fun"] ? "DANGER" : "SUCCESS");
                                const fun = new MessageButton()
                                .setCustomId('fun')
                                .setLabel('Fun')
                                .setStyle(daServer?.disabledCategories?.["fun"] ? "DANGER" : "SUCCESS");
                                const events = new MessageButton()
                                .setCustomId('events')
                                .setLabel('Events')
                                .setStyle(daServer?.disabledCategories?.["events"] ? "DANGER" : "SUCCESS");
                                const Moderation = new MessageButton()
                                .setCustomId('Moderation')
                                .setLabel('Moderation')
                                .setStyle(daServer?.disabledCategories?.["Moderation"] ? "DANGER" : "SUCCESS");
                                const other = new MessageButton()
                                .setCustomId('other')
                                .setLabel('Other')
                                .setStyle(daServer?.disabledCategories?.["other"] ? "DANGER" : "SUCCESS");
                                const points = new MessageButton()
                                .setCustomId('points')
                                .setLabel('Points')
                                .setStyle(daServer?.disabledCategories?.["points"] ? "DANGER" : "SUCCESS");
                                const roblox = new MessageButton()
                                .setCustomId('roblox')
                                .setLabel('Roblox')
                                .setStyle(daServer.disabledCategories?.["roblox"] ? "DANGER" : "SUCCESS");
            
                                let categoriesRow = new MessageActionRow().addComponents(AdminFun, fun, events, Moderation);
                                let categoriesRow2 = new MessageActionRow().addComponents(other, points, roblox);
            
                                const save = new MessageButton()
                                .setCustomId('true')
                                .setLabel('Save')
                                .setStyle("PRIMARY");
                                const cancel = new MessageButton()
                                .setCustomId('false')
                                .setLabel('Cancel')
                                .setStyle("PRIMARY");
            
                                let changesRow = new MessageActionRow().addComponents(save, cancel);
            
                                let embed10 = makeEmbed("Server Settings", `**Disable categories**\nClick the buttons to disable/enable those command categories from being run in your server.`, server);
                                
                                
                                let newMsg = await message.reply({embeds: [embed10], components: [categoriesRow,categoriesRow2, changesRow]})
                                if(isSlash) newMsg = await message.fetchReply();
            
                                const collector = newMsg.createMessageComponentCollector({ filter: button =>  button.user.id === author.id, time:   20 * 1000 });
                                newMsg.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 30, errors : ["time"] });
            
                                
                                    
                                collector.on('collect', async a => {
                                        
            
                                    switch (a.customId) {
                                        case "true":
                                            a.update({components:[]});
            
                                            await mongo().then(async (mongoose) =>{
                                                try{ 
                                                    await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                        disabledCategories: daServer.disabledCategories,
                                                    },{upsert:false});
                                                    message.channel.send(`Changes have been saved ✅`)
                                                    guildsCache[message.guild.id] = daServer;
                                                } finally{
                                                    console.log("WROTE TO DATABASE");
                                                    mongoose.connection.close();
                                                }
                                            });
            
                                            break;
                                        case "false":
                                            message.channel.send("Changes have been dismissed. ❌")
                                            a.update({components:[]});
                                            return true;
                                            break;
                                        default:
                                            if(!daServer.disabledCategories)daServer.disabledCategories = {};
                                            collector.resetTimer();
                                            switch (a.customId) {
                                                
                                                case "admin fun":
                                                    daServer.disabledCategories["admin fun"] ? daServer.disabledCategories["admin fun"] = false : daServer.disabledCategories["admin fun"] = true;
                                                    AdminFun.setStyle(daServer.disabledCategories["admin fun"] ? "DANGER" : "SUCCESS");
                                                    a.update({components:[categoriesRow,categoriesRow2,changesRow]});
                                                    break;
                                                    case "fun":
                                                        daServer.disabledCategories["fun"] ? daServer.disabledCategories["fun"] = false : daServer.disabledCategories["fun"] = true;
                                                        fun.setStyle(daServer.disabledCategories["fun"] ? "DANGER" : "SUCCESS");
                                                        a.update({components:[categoriesRow,categoriesRow2,changesRow]});
                                                        break;
                                                    case "events":
                                                        daServer.disabledCategories["events"] ?   daServer.disabledCategories["events"] = false :   daServer.disabledCategories["events"] = true;
                                                        events.setStyle(daServer.disabledCategories["events"] ? "DANGER" : "SUCCESS");
                                                        a.update({components:[categoriesRow,categoriesRow2,changesRow]});
                                                        break;
                                                    case "Moderation":
                                                        daServer.disabledCategories["Moderation"] ? daServer.disabledCategories["Moderation"] = false : daServer.disabledCategories["Moderation"] = true;
                                                        Moderation.setStyle(daServer.disabledCategories["Moderation"] ? "DANGER" : "SUCCESS");
                                                        a.update({components:[categoriesRow,categoriesRow2,changesRow]});
                                                        break;
                                                    case "other":
                                                        daServer.disabledCategories["other"] ? daServer.disabledCategories["other"] = false : daServer.disabledCategories["other"] = true;
                                                        other.setStyle(daServer.disabledCategories["other"] ? "DANGER" : "SUCCESS");
                                                        a.update({components:[categoriesRow,categoriesRow2,changesRow]});
                                                        break;
                                                    case "points":
                                                        daServer.disabledCategories["points"] ? daServer.disabledCategories["points"] = false : daServer.disabledCategories["points"] = true;
                                                        points.setStyle(daServer.disabledCategories["points"] ? "DANGER" : "SUCCESS");
                                                        a.update({components:[categoriesRow,categoriesRow2,changesRow]});
                                                        break;  
                                                    case "roblox":
                                                        daServer.disabledCategories["roblox"] ? daServer.disabledCategories["roblox"] = false : daServer.disabledCategories["roblox"] = true;
                                                        roblox.setStyle(daServer.disabledCategories["roblox"] ? "DANGER" : "SUCCESS");
                                                        a.update({components:[categoriesRow,categoriesRow2,changesRow]});
                                                        break;  
                                            
                                                default:
                                                    break;
                                            }
                                        break;
                                        
                                    }
                                        
                                        
                                });
            
                                collector.on('end', collected => {
                                    if(isSlash) message.editReply({components:[]}).catch(e=>e);
                                    else newMsg.edit({components:[]}).catch(e=>e);
                                });
            
                                return true;
                                break;
                                case "overWriteDefaultPermission":
                                    let embedo71 = makeEmbed("Server Settings", `**Do you want CrazyBot to disable the default commands permission?**\n This will enable you to change the permissions from the server settings under "intergrations"\n Doing so will also allow **EVERYONE** to run all commands of the bot regardless of their perms.\n**WARNING: ONLY ENABLE THIS IF YOU HAVE CHANGED THE COMMANDS PERMISSION FROM THE SERVER SETTINGS**\n This only applies to slash commands`, server);
                                    message.reply({embeds:[embedo71], components: [row]})
                                    .then(async m => {
                                        let replyMessage;
                                        if(isSlash)replyMessage = await  message.fetchReply();
                                        else replyMessage = m;
                                        
                                        replyMessage.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 30, errors : ["time"] })
                                            .then(async a =>{
                                                
                                                switch (a.customId) {
                                                    case "true":
                                                        daServer.overWriteDefaultPermission = true;
                                                        a.update({components:[]});
                                                        break;
                                                    case "false":
                                                        daServer.overWriteDefaultPermission = false;
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
                                                            overWriteDefaultPermission: daServer.overWriteDefaultPermission,
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

                                    case "onlySlash":
                                        let embedo72 = makeEmbed("Server Settings", `**Do you want the bot to only respond to slash commands?**`, server);
                                        message.reply({embeds:[embedo72], components: [row]})
                                        .then(async m => {
                                            let replyMessage;
                                            if(isSlash)replyMessage = await  message.fetchReply();
                                            else replyMessage = m;
                                            
                                            replyMessage.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 30, errors : ["time"] })
                                                .then(async a =>{
                                                    
                                                    switch (a.customId) {
                                                        case "true":
                                                            daServer.onlySlash = true;
                                                            a.update({components:[]});
                                                            break;
                                                        case "false":
                                                            daServer.onlySlash = false;
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
                                                                onlySlash: daServer.onlySlash,
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




                                case "memberlogs":
                                    case "memberlog":
                                    case "member":
                                    case "members":
                                    case "hiByeLog":
                                        let embed11 = makeEmbed("Logs manager", `${type0Message}**Enter your members logging channel. 👤**`, server);
                                        message.reply({embeds:[embed11]})
                                            .then(m => {
                                                message.channel.awaitMessages({filter:messageFilter, max: 1, time : 1000 * 30, errors: ['time']})
                                                    .then(async a => {   
                                                        let toCheck =   checkChannels(a);
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
                                                                    daServer.logs.hiByeLog = "";
                                                                    break;
                                                                default:
                                                                    daServer.logs.hiByeLog = toCheck;
                                                                    break;
                                                        }
                                                        await mongo().then(async (mongoose) =>{
                                                            try{ 
                                                                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                                    logs: daServer.logs,
                                                                },{upsert:false});
                                                                message.channel.send(`**Members logging channel has been successfully updated ✅.**`)
                                                                guildsCache[message.guild.id] = daServer;
                                                            } finally{
                                                                console.log("WROTE TO DATABASE");
                                                                mongoose.connection.close();
                                                            }
                                                        });
                                                    }).catch(e => {
                    
                                                        message.channel.send(idleMessage);
                                                    });
                                            });
                    
                                            return true;
                                        break;
                                        case "messagelogs":
                                        case "deleteLog":
                                        case "message":
                                        case "messages":
                                            let embedo2 = makeEmbed("Logs manager", `${type0Message}**Enter your messages logging channel. 📫**`, server);
                                            message.reply({embeds:[embedo2]})
                                                .then(m => {
                                                    message.channel.awaitMessages({filter:messageFilter, max: 1, time : 1000 * 30, errors: ['time']})
                                                        .then(async a => {   
                                                            let toCheck =   checkChannels(a);
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
                                                                    daServer.logs.deleteLog = "";
                                                                    break;
                                                                default:
                                                                    daServer.logs.deleteLog = toCheck;
                                                                    break;
                                                            }
                                                            await mongo().then(async (mongoose) =>{
                                                                try{ 
                                                                    await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                                        logs: daServer.logs,
                                                                    },{upsert:false});
                                                                    message.channel.send(`**Messages logging channel has been successfully updated ✅.**`)
                                                                    guildsCache[message.guild.id] = daServer;
                                                                } finally{
                                                                    console.log("WROTE TO DATABASE");
                                                                    mongoose.connection.close();
                                                                }
                                                            });
                                                        }).catch(e => {
                                                            message.channel.send(idleMessage);
                                                        });
                                                });
                                                return true;
                                            break;
                                            case "serverlogs":
                                            case "serverLog":
                                        
                                                let embedo3 = makeEmbed("Logs manager", `${type0Message}**Enter your Server logging channel. 🏠**`, server);
                                                message.reply({embeds:[embedo3]})
                                                    .then(m => {
                                                        message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                                            .then(async a => {   
                                                                let toCheck =   checkChannels(a);
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
                                                                        daServer.logs.serverLog = "";
                                                                        break;
                                                                    default:
                                                                        daServer.logs.serverLog = toCheck;
                                                                        break;
                                                                }
                                                                await mongo().then(async (mongoose) =>{
                                                                    try{ 
                                                                        await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                                            logs: daServer.logs,
                                                                        },{upsert:false});
                                                                        message.channel.send(`**Server logging channel has been successfully updated ✅.**`)
                                                                        guildsCache[message.guild.id] = daServer;
                                                                    } finally{
                                                                        console.log("WROTE TO DATABASE");
                                                                        mongoose.connection.close();
                                                                    }
                                                                });
                                                            }).catch(e => {
                    
                                                                message.channel.send(idleMessage);
                                                            });
                                                    });
                    
                                                    return true;
                                                break;
                                                case "modlogs":
                                                case "modlog":
                                                case "mod":
                                                case "moderation":
                                                case "warningLog":
                                                    let embedo4 = makeEmbed("Logs manager", `${type0Message}**Enter your moderation logging channel. 🔨**`, server);
                                                    message.reply({embeds:[embedo4]})
                                                        .then(m => {
                                                            message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                                                .then(async a => {   
                                                                    let toCheck =   checkChannels(a);
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
                                                                            daServer.logs.warningLog = "";
                                                                            break;
                                                                        default:
                                                                            daServer.logs.warningLog = toCheck;
                                                                            break;
                                                                    }
                                                                    await mongo().then(async (mongoose) =>{
                                                                        try{ 
                                                                            await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                                                logs: daServer.logs,
                                                                            },{upsert:false});
                                                                            message.channel.send(`**Moderation logging channel has been successfully updated ✅.**`)
                                                                            guildsCache[message.guild.id] = daServer;
                                                                        } finally{
                                                                            console.log("WROTE TO DATABASE");
                                                                            mongoose.connection.close();
                                                                        }
                                                                    });
                                                                }).catch(e => {
                                                                    message.channel.send(idleMessage);
                                                                });
                                                        });
                                                        return true;
                                                    break;
                                                    case "pointslogs":
                                                    case "pointsLog":
                                                    case "points":
                                                    case "point":
                                        let embedo5 = makeEmbed("Logs manager", `${type0Message}**Enter your points logging channel. 📈**`, server);
                                        message.reply({embeds:[embedo5]})
                                            .then(m => {
                                                message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                                    .then(async a => {   
                                                        let toCheck =   checkChannels(a);
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
                                                                daServer.logs.pointsLog = "";
                                                                break;
                                                            default:
                                                                daServer.logs.pointsLog = toCheck;
                                                                break;
                                                        }
                                                        await mongo().then(async (mongoose) =>{
                                                            try{ 
                                                                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                                    logs: daServer.logs,
                                                                },{upsert:false});
                                                                message.channel.send(`**Points logging channel has been successfully updated ✅.**`)
                                                                guildsCache[message.guild.id] = daServer;
                                                            } finally{
                                                                console.log("WROTE TO DATABASE");
                                                                mongoose.connection.close();
                                                            }
                                                        });
                                                    }).catch(e => {
                                                        message.channel.send(idleMessage);
                                                    });
                                            });
                                            return true;
                                        break;
                                        case "eventlogs":
                                        case "eventsLog":
                                        case "events":
                                        case "event":
                                        let embed16 = makeEmbed("Logs manager", `${type0Message}**Enter your events logging channel. 📢**`, server);
                                        message.reply({embeds:[embed16]})
                                            .then(m => {
                                                message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                                    .then(async a => {   
                                                        let toCheck =   checkChannels(a);
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
                                                                daServer.logs.eventsLog = "";
                                                                break;
                                                            default:
                                                                daServer.logs.eventsLog = toCheck;
                                                                break;
                                                        }
                                                        await mongo().then(async (mongoose) =>{
                                                            try{ 
                                                                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                                    logs: daServer.logs,
                                                                },{upsert:false});
                                                                message.channel.send(`**Events logging channel has been successfully updated ✅.**`)
                                                                guildsCache[message.guild.id] = daServer;
                                                            } finally{
                                                                console.log("WROTE TO DATABASE");
                                                                mongoose.connection.close();
                                                                
                                                            }
                                                        });
                                                    }).catch(e => {
                                                        message.channel.send(idleMessage);
                                                        return false;
                                                    });
                                                    
                                            });
                                            return true;
                                        break;

                                        case "verifiedrole":
                                            case "role":
                                            case "verify":
                                            case "verifiedrole":
                                            case "verifiedRole":
                                                let embedo11 = makeEmbed("Roblox server Settings", `${type0Message}**Enter  your verified role.**`, server);
                                                message.reply({embeds: [embedo11]})
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
                                            case "forceRobloxNames":
                                                let embed17 = makeEmbed("Roblox server Settings", `**Do you want Roblox usernames to be nicknames in this discord?**\nThis will change the nickname of everyone in this server.`, server);
                                                message.reply({embeds:[embed17], components: [row]})
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
                                
                        default:
                            message.channel.send("Invalid value.");
                            break;

                    }
                    break;
                
            }
        });

        collector.on('end', collected => {
            if(isSlash) message.editReply({components:[]}).catch(e=>e)//if e, message was deleted
            else newMsg.edit({components:[]}).catch(e=>e)//if e, message was deleted
        });

    } catch (err) {
        console.log(err);
    }

}

module.exports = panel;