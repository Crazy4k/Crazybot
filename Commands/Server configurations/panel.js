const makeEmbed = require('../../functions/embed');
const type0Message = "(type `0` to cancel / type \"`no`\" for none)\n";
const type0Message2 = "(type `0` to cancel / type \"`no`\" for none)\n";  
const idleMessage = "Command cancelled due to the user being idle";
const cancerCultureMessage = "Command cancelled successfully";
const checkChannels = require("../../functions/Response based Checkers/checkChannels");
const checkRoles = require("../../functions/Response based Checkers/checkRoles");
const mongo = require("../../mongo");
let cache = require("../../caches/botCache");
const pointsSchema = require("../../schemas/points-schema");
const enable = require("../../functions/enablePoints");


const colors = require("../../config/colors.json");
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

    let author = isSlash ? message.user : message.author;
    
    
    /*




    * BUTTONS CREATION





    */
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
        {label: "Points logs", value: "pointsLog", default: false}
        
    );

    const robloxMenu = new MessageSelectMenu()
    .setCustomId("roblox-menu")
    .setOptions(
        {label: "Verified role", value: "verifiedRole", default: false},
        {label: "Roblox usernames as Discord nicknames", value: "forceRobloxNames", default: false},
    )

    const pointsMenu = new MessageSelectMenu()
    .setCustomId("points-menu")
    .setOptions(
        {label: "Change Points role", value: "points-role", default: false},
        
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
    const promotionButton = new MessageButton()
    .setCustomId("promotion-button")
    .setStyle("PRIMARY")
    .setLabel("Points promotions")
    const pointsSettingsButton = new MessageButton()
    .setCustomId("pointsButton")
    .setStyle("PRIMARY")
    .setLabel("Points");

    const navigationRow = new MessageActionRow().addComponents(serverButton, logsButton, robloxButton, promotionButton, pointsSettingsButton);
    


    const idMenu = new MessageSelectMenu()
    .setCustomId("id-menu")
    .setOptions(
        {label: "1", value: "1", default: false},
        {label: "2", value: "2", default: false},
        {label: "3", value: "3", default: false},
        {label: "4", value: "4", default: false},
        {label: "5", value: "5", default: false},
        {label: "6", value: "6", default: false},
        {label: "7", value: "7", default: false},
        {label: "8", value: "8", default: false},
        {label: "9", value: "9", default: false},
        {label: "10", value: "10", default: false},
        {label: "11", value: "11", default: false},
        {label: "12", value: "12", default: false},
        {label: "13", value: "13", default: false},
        {label: "14", value: "14", default: false},
        {label: "15", value: "15", default: false},
        {label: "16", value: "16", default: false},
        {label: "17", value: "17", default: false},
        {label: "18", value: "18", default: false},
        {label: "19", value: "19", default: false},
        {label: "20", value: "20", default: false},
        {label: "21", value: "21", default: false},
        {label: "22", value: "22", default: false},
        {label: "23", value: "23", default: false},
        {label: "24", value: "24", default: false},
        {label: "25", value: "25", default: false}
        
    )

    const addButton = new MessageButton()
    .setCustomId("add-button")
    .setStyle("SUCCESS")
    .setLabel("Add");
    const removeButton= new MessageButton()
    .setCustomId("remove-button")
    .setStyle("DANGER")
    .setLabel("Remove");
    const editButton= new MessageButton()
    .setCustomId("edit-button")
    .setStyle("PRIMARY")
    .setLabel("Edit");
    const cancelButton = new MessageButton()
    .setCustomId("cancel-button")
    .setStyle("DANGER")
    .setLabel("Cancel");

    const pointsButton = new MessageButton()
    .setCustomId("points-button")
    .setStyle("PRIMARY")
    .setLabel("Points");
    const roleButton = new MessageButton()
    .setCustomId("role-button")
    .setStyle("PRIMARY")
    .setLabel("Role");
    const yes = new MessageButton()
    .setCustomId('true')
    .setLabel('Yes')
    .setStyle('SUCCESS');
    const no = new MessageButton()
    .setCustomId('false')
    .setLabel('No')
    .setStyle('DANGER');



    let row = new MessageActionRow().addComponents(yes, no);
    const editRow = new MessageActionRow().setComponents(pointsButton, roleButton, cancelButton); 
    const cancelRow = new MessageActionRow().setComponents(cancelButton);
    const idMenuRow = new MessageActionRow().setComponents(idMenu);

    /*

    * PRE-RESPONSE PROCCESSES

    */

    const messageFilter = m => !m.author.bot && m.author.id === author.id;
    const buttonFilter =  noob => noob.user.id === author.id && !noob.user.bot;

    if(!server.pointsEnabled) await enable( message, server);
    let servery = cache.pointsCache[message.guild.id];
    let log = message.guild.channels.cache.get(server.logs.pointsLog);  

    if(!servery){
        await mongo().then(async (mongoose) =>{
            try{
                const data = await pointsSchema.findOne({_id:message.guild.id});
                cache.pointsCache[message.guild.id] = servery = data;
            }
            finally{
                    
                console.log("FETCHED FROM DATABASE");
                mongoose.connection.close();
            }
        })
    }
    
    if(!servery.rewards || Object.values(cache.pointsCache).length === 0){
        let rewards = {
            "1": [0,""],
            "2": [0,""],
            "3": [0,""],
            "4": [0,""],
            "5": [0,""],
            "6": [0,""],
            "7": [0,""],
            "8": [0,""],
            "9": [0,""],
            "10": [0,""],
            "11": [0,""],
            "12": [0,""],
            "13": [0,""],
            "14": [0,""],
            "15": [0,""],
            "16": [0,""],
            "17": [0,""],
            "18": [0,""],
            "19": [0,""],
            "20": [0,""],
            "21": [0,""],
            "22": [0,""],
            "23": [0,""],
            "24": [0,""],
            "25": [0,""],
        }
        await mongo().then(async (mongoose) =>{
            try{
                await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                    rewards : rewards
                        
                },{upsert:true});
                if(log){
                    let embed = makeEmbed("Promotion system enabled","","10AE03",true);
                    embed.setAuthor({name: author.tag, iconURL : author.displayAvatarURL()});
                    log.send({embeds: [embed]});
                }
                
            } finally{
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
                cache.pointsCache[message.guild.id].rewards = servery.rewards = rewards;
            }
        })
 
        console.log(`Correcting rewards data for guild ${message.guild.name} - ${message.guild.id}`);
    }

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
            {name:'Delete messages in logs?', value:`${server.deleteMessagesInLogs? "✅" : "❌"}`, inline:true},
            {name:'Delete failed commands? 🕐', value:`${server.deleteFailedCommands ? "✅" : "❌"}`, inline:true},
            {name:'Ignore default required permission for slash commands?', value:`${server.overWriteDefaultPermission? "✅" : "❌"}`, inline:true},
            {name:'Slash commands only', value:`${server.onlySlash? "✅" : "❌"}`, inline:true},
            {name:'Prefix ℹ', value:`${server.prefix}`, inline:true},
            {name:'Default embed color 🎨', value:`${server.defaultEmbedColor}`, inline:true},
            {name:"Disabled command categories", value:`${disabledCategories.length ? disabledCategories.join(", ") : "-" }`, inline : true}
        );

        
        let newMsg = await message.reply({embeds:[embed], components: [navigationRow, configRow]});
        if(!newMsg) newMsg = await message.fetchReply();

        
        const collector = newMsg.createMessageComponentCollector({ filter: buttonFilter, time: 30 * 1000 });

        let daServer = server;
        let action;
        let id;

        collector.on('collect', async i => {
            collector.resetTimer();
            //if button
            switch (i.customId){

                /*

                * NAVIGATION BUTTONS

                */
                case "server-button":

                    serverButton.setDisabled(true);
                    logsButton.setDisabled(false);
                    robloxButton.setDisabled(false);
                    promotionButton.setDisabled(false);
                    pointsSettingsButton.setDisabled(false);

                    embed.setDescription("Every available setting is listed below");
                    embed.setFields(
                        {name:"\u200b",value:"**Server configurations**", inline: false},
                        {name:"Welcome channel 👋", value:`${server.hiByeChannel ? "<#"+server.hiByeChannel+">" : "empty"}`, inline: true},
                        {name:"Welcome role 👋", value:`${server.hiRole ? "<@&"+server.hiRole+">" : "empty"}`, inline: true},
                        {name:'Delete messages in logs?', value:`${server.deleteMessagesInLogs? "✅" : "❌"}`, inline:true},
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
                    promotionButton.setDisabled(false);
                    pointsSettingsButton.setDisabled(false);

                    embed.setDescription("Every available setting is listed below");
                    embed.setFields(
                        {name:"\u200b",value:"**Logging channels**", inline: false},
                        {name: "Member logs 👤", value:`${ server.logs.hiByeLog ? "<#" +server.logs.hiByeLog +">" : "Empty"}`, inline: true},
                        {name: "Messages logs 📫", value:`${ server.logs.deleteLog ? "<#" +server.logs.deleteLog +">" : "Empty"}`, inline: true},
                        {name: "Server logs 🏠", value:`${ server.logs.serverLog ? "<#" +server.logs.serverLog +">" : "Empty"}`, inline: true},
                        {name: "Moderation logs 🔨", value:`${ server.logs.warningLog ? "<#" +server.logs.warningLog +">" : "Empty"}`, inline: true},
                        {name: "Points logs 📈", value:`${ server.logs.pointsLog ? "<#" +server.logs.pointsLog +">" : "Empty"}`, inline: true}
                    )
                    configRow.setComponents(logsMenu);
                    i.update({embeds:[embed], components: [navigationRow, configRow]});
                    break;

                case "roblox-button":

                    serverButton.setDisabled(false);
                    logsButton.setDisabled(false);
                    robloxButton.setDisabled(true);
                    promotionButton.setDisabled(false);
                    pointsSettingsButton.setDisabled(false);

                    embed.setDescription("Every available setting is listed below");
                    embed.setFields(
                        {name:"\u200b",value:"**Roblox configurations**", inline: false},
                        {name: "Verified role", value:`${server.verifiedRole ? "<@&"+server.verifiedRole+">" : "empty"}`, inline: true},
                        {name: "Roblox usernames as Discord nicknames?", value:`${server.forceRobloxNames? "✅": "❌"}`, inline: true}
                    )
                    configRow.setComponents(robloxMenu);
                    i.update({embeds:[embed], components: [navigationRow, configRow]});
                    break;


                case "promotion-button":
                    serverButton.setDisabled(false);
                    logsButton.setDisabled(false);
                    robloxButton.setDisabled(false);
                    promotionButton.setDisabled(true);
                    pointsSettingsButton.setDisabled(false);

                    embed.setDescription(`Whenever a member reaches a certain amount of points, they will automatically be rewarded with a role.\n The maximum amount of roles that can be set is 25 and the bot must be able to give/remove these roles.`);
                    embed.addField("\u200b", "**List of added roles**", false);
                    embed.spliceFields(0,25);
                    for(let I in servery.rewards){
                        let role = `<@&${servery.rewards[I][1]}>`
                        if(servery.rewards[I][1] === "" || !servery.rewards[I][1])role ="`None`";
                        if(servery.rewards[I][0] > 0 && role !== "`None`"){
                            embed.addField(`**ID - ${I}:**`,`Required points: ${servery.rewards[I][0]}\nRewarded role: ${role}\n id number:\`${I}\``,true);
                        }
                        
                    }

                    configRow.setComponents(addButton, removeButton, editButton);
                    i.update({embeds:[embed], components: [navigationRow, configRow]});
                    break;

                case "pointsButton":

                    serverButton.setDisabled(false);
                    logsButton.setDisabled(false);
                    robloxButton.setDisabled(false);
                    promotionButton.setDisabled(false);
                    pointsSettingsButton.setDisabled(true);

                    embed.setDescription("Every available setting is listed below");
                    embed.setFields(
                        {name:"\u200b",value:"**Points configurations**", inline: false},
                        {name: "Points management role", value:`${servery.whiteListedRole ? "<@&"+servery.whiteListedRole+">" : "empty"}`, inline: true},
                        
                    );

                    configRow.setComponents(pointsMenu);
                    i.update({embeds:[embed], components: [navigationRow, configRow]});

                    break;

                    /*

                    * OTHER BUTTONS

                    */

                case "add-button":
            
                    let emptyNumber;

                    for(let I in servery.rewards){
                        if(!servery.rewards[I][1] && servery.rewards[I][0] === 0){
                            emptyNumber = parseInt(I);
                            break;
                        }
                    }
                    
                    if(typeof emptyNumber === "number"){

                        collector.stop();

                        let promotionEmbed_addButton_01 = makeEmbed("Points rewards", `${type0Message}**Enter the amount of required points you want for this reward\n Value MUST be a positive whole number.**`, server);
                        message.channel.send({embeds:[promotionEmbed_addButton_01]})
                        .then(m => {
                            message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                .then(async a => {   
                                    let content = a.first().content;
                                    
                                    switch (content) {
                                        
                                        case "cancel":
                                            message.channel.send(cancerCultureMessage);
                                            return false;
                                            break;
                                        default:

                                            if(!isNaN(parseInt(content))){
                                                

                                                servery.rewards[emptyNumber][0] = parseInt(content);


                                                let promotionEmbed_addButton_02 =  makeEmbed("Points rewards", `${type0Message2}**Enter the role that you want to be rewarded on that tier.**`, server);
                                                message.channel.send({embeds:[promotionEmbed_addButton_02]})
                                                    .then(m => {
                                                        message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                                            .then(async a => {   
                                                                let toCheck =   checkRoles(a);
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
                                                                        servery.rewards[emptyNumber][1] = "";
                                                                        break;
                                                                    default:
                                                                        servery.rewards[emptyNumber][1] = toCheck;
                                                                        break;
                                                                }
                                                                await mongo().then(async (mongoose) =>{
                                                                    try{ 
                                                                        await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                                                                            rewards: servery.rewards
                                                                        },{upsert:false});
                                                                        let success = makeEmbed("",`**Reward with id (#${emptyNumber}) has been successfully added. ✅.**`,colors.successGreen)
                                                                        .addField("Role", `<@&${toCheck}>`, true)
                                                                        .addField("Required points", `${servery.rewards[emptyNumber][0]}`, true);
                                                                        message.channel.send({embeds:[success]});
                                                                        cache.pointsCache[message.guild.id] = servery;
                                                                    } finally{
                                                                        console.log("WROTE TO DATABASE");
                                                                        mongoose.connection.close();
                                                                    }
                                                                });
                                                            }).catch(e => {
                                                                console.log(e);
                                                                message.channel.send(idleMessage);
                                                                return false;
                                                            });
                                                    });

                                                

                                            }else {
                                                sendAndDelete(message,"Inavalid value, argument **must** be a number",server);
                                                return false;
                                                break;
                                            }
                                            
                                            break;
                                    }
                                    
                                }).catch(e => {
                                    console.log(e);
                                    message.channel.send(idleMessage);
                                    return false;
                                });
                                
                        });
                        return true;
                    } else {
                        sendAndDelete(message, "Max limit of roles reached. Consider deleting or editing other rewards.", server);
                        
                        return false;
                    }
                    break;

                case "edit-button":
                case "remove-button":

                    i.update({components: [idMenuRow, cancelRow]}); 
                    action = i.customId;
                    
                    break;

                case "points-button":
                            
                    i.update({components:[]});
                    let promotionEmbed_editButton_03 =  makeEmbed("Points rewards", `${type0Message2}**Enter the role that you want to be rewarded on that tier.**`, server);
                    message.channel.send({embeds:[promotionEmbed_editButton_03]})
                        .then(m => {
                            message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                .then(async a => {   
                                    
                                    let content = a.first().content;
                                
                                    switch (content) {
                                        
                                        case "cancel":
                                            message.channel.send(cancerCultureMessage);
                                            return false;
                                            break;
                                        default:
                                            if(!isNaN(parseInt(content))){
                                                
    
                                                servery.rewards[id][0] = parseInt(content);

                                                await mongo().then(async (mongoose) =>{
                                                    try{ 
                                                        await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                                                            rewards: servery.rewards
                                                        },{upsert:false});
                                                        let success = makeEmbed("",`**Reward with id (#${id}) has been successfully updated. ✅.**`,colors.successGreen)
                                                        .addField("Role", `<@&${servery.rewards[id][1]}>`, true)
                                                        .addField("Required points", `${servery.rewards[id][0]}`, true);
                                                        message.channel.send({embeds:[success]});
                                                        cache.pointsCache[message.guild.id] = servery;
                                                    } finally{
                                                        console.log("WROTE TO DATABASE");
                                                        mongoose.connection.close();
                                                    }
                                                });
                                            } else {
                                                message.channel.send("Number is not valid.");
                                                return false;
                                                break;
                                            }
                                        }

                                    
                                }).catch(e => {
                                    console.log(e);
                                    message.channel.send(idleMessage);
                                    return false;
                                });
                        });

                    break;

                case "role-button": 

                    i.update({components:[]});
                    let promotionEmbed_editButton_04 =  makeEmbed("Points rewards", `${type0Message2}**Enter the role that you want to be rewarded on that tier.**`, server);
                    message.channel.send({embeds:[promotionEmbed_editButton_04]})
                        .then(m => {
                            message.channel.awaitMessages({filter:messageFilter,max: 1, time : 1000 * 30, errors: ['time']})
                                .then(async a => {   
                                    let toCheck =   checkRoles(a);
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
                                            servery.rewards[id][1] = "";
                                            break;
                                        default:
                                            servery.rewards[id][1] = toCheck;
                                            break;
                                    }
                                    await mongo().then(async (mongoose) =>{
                                        try{ 
                                            await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                                                rewards: servery.rewards
                                            },{upsert:false});
                                            let success = makeEmbed("",`**Reward with id (#${id}) has been successfully updated. ✅.**`,colors.successGreen)
                                            .addField("Role", `<@&${toCheck}>`, true)
                                            .addField("Required points", `${servery.rewards[id][0]}`, true);
                                            message.channel.send({embeds:[success]});
                                            cache.pointsCache[message.guild.id] = servery;
                                        } finally{
                                            console.log("WROTE TO DATABASE");
                                            mongoose.connection.close();
                                        }
                                    });
                                }).catch(e => {
                                    console.log(e);
                                    message.channel.send(idleMessage);
                                    return false;
                                });
                        });

                    break;

                case "true":

                    collector.stop();
                    servery.rewards[id][0] = 0;
                    servery.rewards[id][1] = "";
                    await mongo().then(async (mongoose) =>{
                        try{ 
                            await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                                rewards: servery.rewards
                            },{upsert:false});
                            let success = makeEmbed("",`**Reward with id (#${id}) has been successfully deleted. ✅.**`,colors.successGreen)
                            message.channel.send({embeds:[success]});
                            cache.pointsCache[message.guild.id] = servery;
                        } finally{
                            console.log("WROTE TO DATABASE");
                            mongoose.connection.close();
                        }
                    });

                    break;

                case "false":
                case "cancel-button": 

                    message.channel.send(cancerCultureMessage);
                    collector.stop();
                    return false;

                    break;

                case "id-menu":

                    id = parseInt(i.values[0]);

                    if(servery.rewards[id][1] || servery.rewards[id][0] > 0){

                        let promotionEmbed_editButton_02 =  makeEmbed("Points rewards", `Select what you want to edit with this reward`, server);
                        let shit = `<@&${servery.rewards[id][1]}>`
                        let achievable = "**YES**"
                        if(servery.rewards[id][1] === "" || !servery.rewards[id][1]){shit ="`None`";achievable = "**NO**"}
                        if(servery.rewards[id][0] <= 0) achievable = "**NO**"
                        promotionEmbed_editButton_02.addFields(
                            {name:`**Required points:**`,value:`\`${servery.rewards[id][0]}\``,inline:false},
                            {name:`**Given role:**`,value:`${shit}`,inline:false},
                            {name:`**Achievable?:**`,value:`${achievable}`,inline:false},
                        );


                        if(action === "edit-button"){
                            i.update({embeds:[promotionEmbed_editButton_02], components:[editRow]})
                        } else {
                            promotionEmbed_editButton_02.setTitle("Are you sure you want to delete this reward?");
                            promotionEmbed_editButton_02.setDescription("");
                            i.update({embeds:[promotionEmbed_editButton_02], components:[row]});
                        }
                        
                    } else {
                        i.update({components: [idMenuRow, cancelRow]}); 
                        sendAndDelete(message,"This reward is not editable!", server);
                    }
                    break;


                default://if menu
                    
                    collector.stop();
                    
                    switch (i.values[0]) {






                        /*

                        * SERVER SETTINGS MENU

                        */






                        case "hiByeChannel":

                            let embedo = makeEmbed("Server Settings", `${type0Message}**Enter  your welcoming channel.👋**`, server);
                            message.channel.send({embeds: [embedo]})
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

                        
                        case "hiRole":

                            let embedo1 = makeEmbed("Server Settings", `${type0Message}**Enter  your welcoming role.👋**`, server);
                            message.channel.send({embeds: [embedo1]})
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

                        case "defaultEmbedColor":

                            let embedo9 = makeEmbed("Server Settings", `(type \`0\` to cancel / type "\`reset\`" to reset it to default (*#F7F7F7*)\n**Enter the hexadecimal color value you want the embeds sent by the bot to have 🎨**\nExample: #F7F7F7, #1FFA01\nUse this [Website](https://htmlcolorcodes.com) to find a hex color value quickly`, server);
                            message.channel.send({embeds: [embedo9]})
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
                            message.channel.send({embeds: [embedo8]})
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
                            
                        case "deleteMessagesInLogs":

                            let embedo6 = makeEmbed("Server Settings", `**Do you want messages to be deleted in logs?❌**`, server);
                            message.channel.send({embeds: [embedo6], components: [row]})
                            .then(async m => {
                                
                                m.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 30, errors : ["time"] })
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

                        case "deleteFailedCommands":

                            let embedo7 = makeEmbed("Server Settings", `**Do you want failed commands to be deleted after a few seconds?🕐**`, server);
                            message.channel.send({embeds:[embedo7], components: [row]})
                            .then(async m => {
                                
                                
                                m.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 30, errors : ["time"] })
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

                        
                        case "disabledCategories":

                            const AdminFun = new MessageButton()
                            .setCustomId('admin fun')
                            .setLabel('Admin fun')
                            .setStyle(daServer?.disabledCategories?.["admin fun"] ? "DANGER" : "SUCCESS");
                            const fun = new MessageButton()
                            .setCustomId('fun')
                            .setLabel('Fun')
                            .setStyle(daServer?.disabledCategories?.["fun"] ? "DANGER" : "SUCCESS");
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
        
                            let categoriesRow = new MessageActionRow().addComponents(AdminFun, fun, Moderation);
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
                            
                            
                            let newMsg2 = await message.reply({embeds: [embed10], components: [categoriesRow,categoriesRow2, changesRow]})
                            if(isSlash) newMsg2 = await message.fetchReply();
        
                            const collector = newMsg2.createMessageComponentCollector({ filter: button =>  button.user.id === author.id, time:   20 * 1000 });
                            newMsg2.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 30, errors : ["time"] });
        
                            
                                
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
                                else newMsg2.edit({components:[]}).catch(e=>e);
                            });
        
                            return true;
                            break;

                        case "overWriteDefaultPermission":

                            let embedo71 = makeEmbed("Server Settings", `**Do you want CrazyBot to disable the default commands permission?**\n This will enable you to change the permissions from the server settings under "intergrations"\n Doing so will also allow **EVERYONE** to run all commands of the bot regardless of their perms.\n**WARNING: ONLY ENABLE THIS IF YOU HAVE CHANGED THE COMMANDS PERMISSION FROM THE SERVER SETTINGS**\n This only applies to slash commands`, server);
                            message.channel.send({embeds:[embedo71], components: [row]})
                            .then(async m => {
                                
                                
                                m.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 30, errors : ["time"] })
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
                            message.channel.send({embeds:[embedo72], components: [row]})
                            .then(async m => {
                                
                                
                                m.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 30, errors : ["time"] })
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


                        /*









                        * LOGS MENU












                        */




                        case "hiByeLog":

                            let embed11 = makeEmbed("Logs manager", `${type0Message}**Enter your members logging channel. 👤**`, server);

                            message.channel.send({embeds:[embed11]})
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

                        
                        case "deleteLog":
                        
                            let embedo2 = makeEmbed("Logs manager", `${type0Message}**Enter your messages logging channel. 📫**`, server);
                            message.channel.send({embeds:[embedo2]})
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

                        
                        case "serverLog":
                    
                            let embedo3 = makeEmbed("Logs manager", `${type0Message}**Enter your Server logging channel. 🏠**`, server);
                            message.channel.send({embeds:[embedo3]})
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

                        
                        case "warningLog":

                            let embedo4 = makeEmbed("Logs manager", `${type0Message}**Enter your moderation logging channel. 🔨**`, server);
                            message.channel.send({embeds:[embedo4]})
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

                        case "pointsLog":

                            let embedo5 = makeEmbed("Logs manager", `${type0Message}**Enter your points logging channel. 📈**`, server);
                            message.channel.send({embeds:[embedo5]})
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

                        /*









                        * ROBLOX MENU












                        */
                        
                        case "verifiedRole":

                        let embedo11 = makeEmbed("Roblox server Settings", `${type0Message}**Enter  your verified role.**`, server);
                        message.channel.send({embeds: [embedo11]})
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
                                
                        
                        case "forceRobloxNames":

                            let embed17 = makeEmbed("Roblox server Settings", `**Do you want Roblox usernames to be nicknames in this discord?**\nThis will change the nickname of everyone in this server.`, server);
                            message.channel.send({embeds:[embed17], components: [row]})
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
                                     
                            /*









                            * POINTS PROMOTION MENU




















                            * POINTS MENU












                            */

                                       
                            
                        case "points-role":

                            const pointsRoleEmbed = makeEmbed("Points management role",`Enter the role that you want to be able to modify points of others.\nThis role will be able to view,remove,add and change the points of all users.\nType \`no\` for no one except admins.`, server);
    
                            message.reply({embeds:[pointsRoleEmbed]});
                            const messageFilter = m => !m.author.bot && m.author.id === author.id;
                            message.channel.awaitMessages({filter: messageFilter, max: 1, time : 120000, errors: ['time']})
                                .then(async (a) => {
                                    let checkedRole = checkRoles(a);
                                    switch (checkedRole) {
                                        case "not valid":
                                        case "not useable":
                                        case "no args":               
                                            message.channel.send("Invalid argument, command failed.");
                                            return false;
                                            break;
                                        case "cancel":
                                        case "no":
                                            whiteListedRole = "";
                                            break;
                                        default:     
                                            whiteListedRole = checkedRole;
                                            break;
                                        }                                        
                    
                                        await mongo().then(async (mongoose) =>{
                                            try{
                                                await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                                                    whiteListedRole: whiteListedRole
                                                },{upsert:true});
                                            } finally{
                                                console.log("WROTE TO DATABASE");
                                                mongoose.connection.close();
                                            }
                                        })
                                        cache.pointsCache[message.guild.id].whiteListedRole = whiteListedRole;
                                        let text = `Poeple with the role <@&${whiteListedRole}> can now modify other user's points.`;
                                        if(whiteListedRole === "") text = `Only admins can now modify other user's points.`
                                        const pointsRoleEmbed2 = makeEmbed(`✅ points manager role has been updated.`,text, "#24D900");
                                        message.channel.send({embeds:[pointsRoleEmbed2]}).catch(e=> console.log(e));
                                        return true;
                                });
            
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