const makeEmbed = require('../../functions/embed');
const colors = require("../../config/colors.json");
const sendAndDelete = require("../../functions/sendAndDelete");
const noblox = require("noblox.js");
const mongo = require("../../mongo");
let {guildsCache} = require("../../caches/botCache");
const serversSchema = require("../../schemas/servers-schema");
const Command = require("../../Classes/Command");
const {MessageActionRow, MessageButton} = require("discord.js");

const checkRoles = (message, arg) => {
    if(arg) {
        if(!isNaN(parseInt(arg)) && arg.length >= 17){
            if(message.guild.roles.cache.get(arg)) {
                return arg;
            } else return "not valid";

        }else if(message.mentions.roles.first()){
            let id = arg.slice(3, arg.length-1);
            if(id.startsWith("&"))id = arg.slice(1, arg.length-1);
            let thing = message.mentions.roles.get(id);
            if(thing)return thing.id;
            else return "not valid";
        }else{
            let e = message.guild.roles.cache.find(role => role.name.toLowerCase() === arg.toLowerCase())
			if(e){
				return e.id;
			}else if(message.mentions.everyone) {
                return "everyone";
            } else return "not useable";
        }
    } else return "no args";
}

const idleMessage = "Command cancelled due to the user being idle";
const cancerCultureMessage = "Command cancelled successfully";
let binds = new Command("binds");
binds.set({
	aliases         : ["autorole","auto-role"],
	description     : "Adds/removes group binds",
	usage           : "binds <action: add, remove, edit or view> [group link or id]",
	cooldown        : 5,
	unique          : true,
	category        : "config",
	whiteList       : "ADMINISTRATOR",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    options			: [
        {
            name : "action",
            description : "What action do you want to do on your server's Roblox group binds",
            choices: [
                {name: "Add (group)", value: "add"},
                {name: "Remove (group)", value: "remove"},
                {name: "Edit (roles)", value: "edit"},
                {name: "View (all)", value: "view"},
                
            ],
            required : true,
            type: 3,
		},
        {
            name : "group",
            description : "(optional if viewing) Enter the group id/link that you want to do the action on",
            required : false,
            type: 3,
		},
		

	],
});

binds.execute = async function(message, args, server, isSlash) {

    let author;
    let action;
    let group;

    if(isSlash){
        author = message.user;
        action = args[0].value;
        group = args[1]?.value;
        
    }
    else {
        action = args[0];
        group = args[1];
        author = message.author;
    }

    const filter = button =>  button.user.id === author.id;

    const yes = new MessageButton()
    .setCustomId('true')
    .setLabel('Yes')
    .setStyle('SUCCESS');
    const no = new MessageButton()
    .setCustomId('false')
    .setLabel('No')
    .setStyle('DANGER');
    let row = new MessageActionRow().addComponents(yes, no);

    const enbInteractionButton = new MessageButton()
    .setCustomId('end')
    .setLabel('Finish')
    .setStyle('SUCCESS');
    const cancelInteraction = new MessageButton()
    .setCustomId('cancel')
    .setLabel('Cancel')
    .setStyle('DANGER');
    let editRow = new MessageActionRow().addComponents(enbInteractionButton, cancelInteraction);


    const previousButton = new MessageButton()
    .setCustomId('previous')
    .setEmoji("⏪")
    .setLabel('Previous')
    .setStyle('SUCCESS');
    const nextButton = new MessageButton()
    .setCustomId('next')
    .setEmoji("⏩")
    .setLabel('Next')
    .setStyle('SUCCESS');
    const endInteractionButton = new MessageButton()
    .setCustomId('end')
    .setLabel('End interaction')
    .setStyle('SECONDARY');
    let switchRow = new MessageActionRow().addComponents(previousButton, nextButton, endInteractionButton);

    const messageFilter = m => !m.author.bot && m.author.id === author.id;
    const buttonFilter =  noob => noob.user.id === author.id && !noob.user.bot;

    try {        
        let daServer = server;
        switch (action?.toLowerCase()) {
            case undefined:
            case "view":
            case "watch":
            case "v":
                if(isSlash)await message.deferReply();

                let viewArray = [];

                for(let groupID in daServer.robloxBinds){
                    let bindsObject = daServer.robloxBinds[groupID];
                    let string = [];
                    let {name} = await noblox.getGroup(groupID).catch(err=>name = "");
                    let roles = await noblox.getRoles(groupID).catch(e=>console.log(e));
                    let logo = await  noblox.getLogo(groupID).catch(err=>logo = "https://cdn.discordapp.com/attachments/926507472611582002/936336852523298877/2000px-Dialog-error-round.svg.png")
                    let objRoles = {};
                    roles.forEach(role=>objRoles[role.id] = role.name);
                    string.push(`Membership (${groupID}) % ${bindsObject[groupID].length? `<@&${bindsObject[groupID].join("> <@&")}>` : "`Empty`"}`);
                    for(let roleId in bindsObject){
                        if(roleId === groupID)continue;
                        string.push(`${objRoles[roleId]}(${roleId}) % ${bindsObject[roleId].length? `<@&${bindsObject[roleId].join("> <@&")}>` : "`Empty`"}`);
                    }
                    viewArray.push({id: groupID, name, string, logo});
                }
                let targetGroup
                
                if(!group){
                    targetGroup = viewArray[0];
                    previousButton.setDisabled(true);
                } else {
                    let viewGrouId;
                    let viewGroupLinkArray = group.split("/");
                    for(let section of viewGroupLinkArray){
                        if(!isNaN(parseInt(section))){
                            viewGrouId = section;
                            break; 
                        }
                    }
                    targetGroup = viewArray.find(grou=>`${grou.id}` === `${viewGrouId}`);

                    if(viewArray.indexOf(targetGroup) === 0){
                        previousButton.setDisabled(true);
                    } else if(viewArray.indexOf(targetGroup) === viewArray.length - 1){
                        nextButton.setDisabled(true);
                    }
                }
                let buttons = [];
                let helpMessage = `Here are your bound groups and roles:\nUse \`${server.prefix}${this.name} edit <group id or URL>\` to add/remove roles from each roblox group.\nUse \`${server.prefix}${this.name} remove <group id or URL>\` to remove this group entirely.\n\n`; 
                let viewEmbed = makeEmbed("Group binds", `a`, server);
                if(!daServer.robloxBinds || !Object.values(daServer.robloxBinds).length){
                    viewEmbed.setDescription(`You do not have any groups bound, consider adding some using the \`${server.prefix}${this.name} add\` action`);

                }
                else {
                    
                    if(viewArray.length > 1) buttons = [switchRow];
                    viewEmbed.setThumbnail(targetGroup.logo);
                    viewEmbed.setDescription(`${helpMessage}**${targetGroup.name}** | ${targetGroup.id}\n\n\n ${targetGroup.string.join("\n\n")}`)
                }

                let newMsg;
                if(isSlash)message?.editReply({embeds: [viewEmbed], components: buttons});
                else newMsg =  await message.reply({embeds: [viewEmbed], components: buttons});
                
                if(!newMsg) newMsg = await message.fetchReply();
                
                const collector = newMsg.createMessageComponentCollector({ filter, time:   20 * 1000 });
                let index = viewArray.indexOf(targetGroup);
                
                collector.on('collect', async i => {

                    if(i.customId === "next"){
                        
                        collector.resetTimer();
                        index++;
                        targetGroup = viewArray[index];
                        
                        if(index === 0){
                            previousButton.setDisabled(true);
                        } else {
                            previousButton.setDisabled(false);
                        }
                        if(index === viewArray.length - 1){
                            nextButton.setDisabled(true);
                        } else {
                            nextButton.setDisabled(false);
                        }

                        viewEmbed.setDescription(`${helpMessage}**${targetGroup.name}** | ${targetGroup.id}\n\n\n ${targetGroup.string.join("\n\n")}`)
                        viewEmbed.setThumbnail(targetGroup.logo);
                        i.update({embeds:[viewEmbed],  components: [switchRow]});
                    } else if(i.customId === "previous"){
                        
                        collector.resetTimer();
                        index--;
                        
                        targetGroup = viewArray[index];
                        
                        if(index === 0){
                            previousButton.setDisabled(true);
                        } else {
                            previousButton.setDisabled(false);
                        }
                        if(index === viewArray.length - 1){
                            nextButton.setDisabled(true);
                        } else {
                            nextButton.setDisabled(false);
                        }
                        viewEmbed.setDescription(`${helpMessage}**${targetGroup.name}** | ${targetGroup.id}\n\n\n ${targetGroup.string.join("\n\n")}`)
                        viewEmbed.setThumbnail(targetGroup.logo);
                        i.update({embeds:[viewEmbed],  components: [switchRow]});
                    } else if(i.customId === "end"){
                        i.update({components:[]});
                    }
                    
                }); 

                collector.on('end', collected => {
                    if(isSlash) message.editReply({components:[]});
                    else newMsg.edit({components:[]});
                });

                break;

            case "add":
                if(isSlash)await message.deferReply();

                if(!group){
                    const embed = makeEmbed('Missing arguments',this.usage, server);
                    sendAndDelete(message, embed, server);
                    return false;
                }
                let addGroupId;
                let addGroupLinkArray = group.split("/");
                for(let section of addGroupLinkArray){
                    if(!isNaN(parseInt(section))){
                        addGroupId = section;
                        break; 
                    }
                }
                let status = true;
                if(!daServer.robloxBinds || !Object.values(daServer.robloxBinds).length)daServer.robloxBinds = {};
                if(daServer.robloxBinds[addGroupId]){
                    const embed = makeEmbed('Group already added', `This group is already bound. If you want to edit or remove it, use those key words: \`${server.prefix}${this.name} edit\` or \`${server.prefix}${this.name} remove\``, server);
                    sendAndDelete(message, embed, server);
                    return false;
                }
                if(Object.values(daServer.robloxBinds).length >= 10){
                    const embed = makeEmbed('Max amount of groups added', `You reached the maximum amount of bound groups in, consider removing some using \`${server.prefix}${this.name} remove\``, server);
                    sendAndDelete(message, embed, server);
                    return false;
                }
                let roles = await noblox.getRoles(parseInt(addGroupId)).catch(err => status = false);
                if(!status){
                    const embed = makeEmbed('Inavlid group link',`This group link is invalid`, server);
                    sendAndDelete(message, embed, server);
                    return false;
                }
                let array = [];
                let skipGuest = 0;
                daServer.robloxBinds[addGroupId] = {};
                for(let role of roles){
                    if(!skipGuest){
                        skipGuest++;
                        daServer.robloxBinds[addGroupId][addGroupId] = [];
                        array.push(`**membership**: \`${addGroupId}\`\n`);
                        continue;
                    }
                    daServer.robloxBinds[addGroupId][role.id] = [];
                    array.push(`**${role.name}**: \`${role.id}\``);
                }
               
                let addEmbed = makeEmbed("Roblox group binds", `The group with the id [${addGroupId}](https://www.roblox.com/groups/${addGroupId}) has been added to your bound groups with the roles:\n\n ${array.join("\n")}`, colors.successGreen);

                   
                
                await mongo().then(async (mongoose) =>{
                    try{ 
                        await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                            robloxBinds: daServer.robloxBinds,
                        },{upsert:false});
                        
                        guildsCache[message.guild.id] = daServer;
                    } finally{
                        console.log("WROTE TO DATABASE");
                        mongoose.connection.close();
                    }
                });
                        
                if(isSlash)message?.editReply({embeds: [addEmbed]});
                else message.reply({embeds: [addEmbed]});
                return true;
                break;
               
            case "remove":
            case "delete":

                if(!group){
                    const embed = makeEmbed('Missing arguments',this.usage, server);
                    sendAndDelete(message, embed, server);
                    return false;
                }

                let removeGroupId;
                let removeGroupLinkArray = group.split("/");

                for(let section of removeGroupLinkArray){
                    if(!isNaN(parseInt(section))){
                        removeGroupId = section;
                        break; 
                    }
                }
                
                if(!daServer.robloxBinds || !Object.values(daServer.robloxBinds).length)daServer.robloxBinds = {};
                if(!daServer.robloxBinds[removeGroupId]){
                    const embed = makeEmbed("Group isn't bound", `This group is not bound in the first place, if you want to add it, use the \`add\` keyword: ${server.prefix}${this.name} add`, server);
                    sendAndDelete(message, embed, server);
                    return false;
                }
                
                
               
                let confirmEmbed = makeEmbed("Roblox group binds",`Are you sure you want to remove the group [${removeGroupId}](https://www.roblox.com/groups/${removeGroupId}) with all of its roles?`, server);
                let removeEmbed = makeEmbed("Roblox group binds", `The group with the id [${removeGroupId}](https://www.roblox.com/groups/${removeGroupId}) has been removed from your group binds`, colors.successGreen);
   
                
                message.reply({embeds:[confirmEmbed], components: [row]})
                .then(async m => {
                    let replyMessage;
                    if(isSlash)replyMessage = await  message.fetchReply();
                    else replyMessage = m;
                    
                    replyMessage.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 30, errors : ["time"] })
                        .then(async a =>{
                            
                            switch (a.customId) {
                                case "true":
                                    delete daServer.robloxBinds[removeGroupId];
                                    await mongo().then(async (mongoose) =>{
                                        try{ 
                                            await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                robloxBinds: daServer.robloxBinds,
                                            },{upsert:false});
                                            guildsCache[message.guild.id] = daServer;
                                        } finally{
                                            console.log("WROTE TO DATABASE");
                                            mongoose.connection.close();
                                        }
                                    });
                                    a.update({components:[], embeds:[removeEmbed]});
                                    break;
                                case "false":
                                default:
                                    message.channel.send(cancerCultureMessage);
                                    a.update({components:[]});
                                    return false;
                                    break;
                            }
                           
                        }).catch(e => {
                            if(isSlash) message.editReply({components:[]});
                            else newMsg.edit({components:[]});
                            message.channel.send(idleMessage);
                        });
                    });
                    return true;
                break;    



                case "edit":

                    if(!group){
                        const embed = makeEmbed('Missing arguments',this.usage, server);
                        sendAndDelete(message, embed, server);
                        return false;
                    }
                    let editGroupId;
                    let editGroupLinkArray = group.split("/");
                    for(let section of editGroupLinkArray){
                        if(!isNaN(parseInt(section))){
                            editGroupId = section;
                            break; 
                        }
                    }
                    
                    if(!daServer.robloxBinds || !Object.values(daServer.robloxBinds).length)daServer.robloxBinds = {};
                    if(!daServer.robloxBinds[editGroupId]){
                        const embed = makeEmbed("Group isn't bound", `This group is not bound in the first place, if you want to add it, use the \`add\` keyword: ${server.prefix}${this.name} add`, server);
                        sendAndDelete(message, embed, server);
                        return false;
                    }
                    
                    
                    
                   
                    let confirmEmbed2 = makeEmbed("Roblox group binds",`Enter the roles you want to be bound with a specific roblox rank like this:\n\n\`Roblox role id\` % \`discord role pings or ids\`\n\n**Examples:**  \n\`123456 % @member \`\n\`234567 % @owner @holder @--------\`\`123456 % @role1 @role2\` \n To remove a bind, simply send the Roblox role id without a discord role.\n\n You can enter more than one message, where each roblox role can be bound to 5 discord roles. However, don't forget to click \`Finish\` when you're done.`, server);
                    let editEmbed = makeEmbed("Roblox group binds", ``, colors.successGreen);
    
                       
                    
                            
                    
                    message.reply({embeds:[confirmEmbed2], components: [editRow]})
                    .then(async m => {
                        let replyMessage;
                        if(isSlash)replyMessage = await  message.fetchReply();
                        else replyMessage = m;

                        const collector = message.channel.createMessageCollector({ filter: messageFilter, time: 1000 * 60 * 3});
                        
                        let rolesObject = daServer.robloxBinds[editGroupId];

                        collector.on('collect', m => {
                            let bootLegArgs = m.content.split(/\n/).join(" ").split(/ +/)

                            if(daServer.robloxBinds[editGroupId][bootLegArgs[0]] === undefined){
                                m.reply("This Roblox role is invalid");
                                return false;
                            }
                           
                            let percent = bootLegArgs.join(" ").split("%")?.[1]?.split(/ +/);
                            percent?.shift();
                            
                            if(rolesObject[bootLegArgs[0]].length) rolesObject[bootLegArgs[0]] = [];
                            for (let i = 0; i < 5; i++) {
                                const element = percent?.[i];
                                if(!percent?.length){
                                    rolesObject[bootLegArgs[0]] = [];
                                    m.react("✅");
                                    m.react("🗑");
                                    break;
                                }
                                let role = checkRoles(m, element);
                                switch(role){
                                    case "everyone":	
                                    case "not valid":
                                    case "not useable":
                                     
            
                                    m.reply("This discord role is invalid");
                                    return false;
                                    break;
                                    case "no args":
                                        break;
                                    default:
                                        
                                        rolesObject[bootLegArgs[0]].push(role);
                                        m.react("✅");
                                }
                                
                            }
                           
                           
                            
                           
                            
                        });
                        collector.on('end', collected => {
                            if(isSlash) message.editReply({components:[]});
                            else m.edit({components:[]});
                        });

                        replyMessage.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 60 * 3, errors : ["time"] })
                            .then(async a =>{

                                switch (a.customId) {
                                    case "end":
                                        daServer.robloxBinds[editGroupId] = rolesObject;
                                        await mongo().then(async (mongoose) =>{
                                            try{ 
                                                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                                                    robloxBinds: daServer.robloxBinds,
                                                },{upsert:false});
                                                guildsCache[message.guild.id] = daServer;
                                            } finally{
                                                console.log("WROTE TO DATABASE");
                                                mongoose.connection.close();
                                            }
                                        });
                                        collector.stop();

                                        let roles = await noblox.getRoles(parseInt(editGroupId)).catch(err => console.log(err));
                                        let skipGuest = 0;
                                        let array = [];
                                        for(let role of roles){
                                            if(!skipGuest){
                                                skipGuest++;
                                                array.push(`**membership**: \`${editGroupId}\` % <@&${daServer.robloxBinds[editGroupId][editGroupId]}>\n`);
                                                continue;
                                            }
                                            array.push(`**${role.name}**: \`${role.id}\` % <@&${daServer.robloxBinds[editGroupId][role.id].join("> <@&")}>`);
                                        }
                                        editEmbed.setDescription(`Group has been successfully updated with the following binds:\n\n ${array.join("\n")}`)
                                        message.channel.send({embeds:[editEmbed]});
                                        a.update({components:[]});
                                        break;
                                    case "cancel":
                                        await mongo().then(async (mongoose) =>{
                                            try{ 
                                                let data = await serversSchema.findOne({_id:message.guildId});
                                                guildsCache[message.guildId] = data;
                                            } catch(error){
                                                console.log(error);
                                            }finally{
                                                console.log("FETCHED FROM DATABASE");
                                                mongoose.connection.close();
                                            }
                                        });
                                    default:
                                        message.channel.send(cancerCultureMessage);
                                        collector.stop();
                                        a.update({components:[]});
                                        return false;
                                        break;
                                }
                               
                            }).catch(e => {
                                console.log(e);
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
        
    
    } catch (err) {console.log(err);}

}

module.exports = binds;