const makeEmbed = require("../../functions/embed");
const Command = require("../../Classes/Command");
const {MessageActionRow, MessageButton} = require("discord.js");
const sendAndDelete = require("../../functions/sendAndDelete");
const fs = require("fs")
const checkUser = require("../../functions/checkUser");
const rover = require("rover-api");
const noblox = require("noblox.js");

function read(string){
    let obj =  fs.readFileSync(string, "utf-8");
    return JSON.parse(obj); 
}

const icons = {
    "1": "https://tr.rbxcdn.com/1dce79e7881a1de84a7caf52e35ddf4f/150/150/Image/Jpeg",
    "2":"https://tr.rbxcdn.com/5739da1f84e84f329f592f01ffbfcc9d/150/150/Image/Jpeg"
}


let raiders = new Command("gamepasses");

raiders.set({
	aliases         : ["gamepass","gp", "passes"],
	description     : "Shows the saved MS gamepasses.",
	usage           : "gamepasses",
	cooldown        : 15,
	unique          : false,
	category        : "roblox",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
    options			: [{
		name : "roblox_username",
		description : "The Roblox username to check for.",
		required : false,
		autocomplete: false,
		type: 3,
		},{
        name : "discord_username",
        description : "Check for the Roblox account of a Discord user.",
        required : false,
        autocomplete: false,
        type: 6,
        }
	],
});

    
    raiders.execute = async function(message, args, server, isSlash){ 

        
    const nextButton = new MessageButton()
        .setCustomId('next')
        .setEmoji("⏩")
        .setLabel('Next page')
        .setStyle('PRIMARY')
    const previousButton = new MessageButton()
        .setCustomId('previous')
        .setEmoji("⏪")
        .setLabel('Previous page')
        .setStyle('PRIMARY')
        .setDisabled();
    const switchButton = new MessageButton()
        .setCustomId('switch')
        .setLabel('Switch Version')
        .setStyle('SECONDARY')
    
    let row = new MessageActionRow().addComponents( previousButton,nextButton, switchButton);

    let isAuthor = false;
    
    let res;
    let status;
    let id;
    let username;
    let args0
    let author;
    if(isSlash){
    
        author = message.user
        if(args[0]){
            args0 = args[0].value;
            username = args[0].value;
        } else {
            username = message.user.id;
            isAuthor = true;
        }
        
    } else {
        args0 = args[0]
        author = message.author
        username = checkUser(message, args, 0);
    }

    if(isSlash)await message.deferReply().catch(e=>console.log(e));
    
    switch (username) {
        
        case "everyone":	
            const embed = makeEmbed('invalid username',"Did you really ping everyone for this?", server);
            message.reply({embeds: [embed]});
            return false;
            break;
        case "not valid":
        case "not useable":

            id = await noblox.getIdFromUsername(args0).catch(e=>id = 0);
            if(!id){
                let robloxUsername = await noblox.getUsernameFromId(args0).catch(e=>id = 0);
                if(robloxUsername)id = args0;
            }
            break;
        case "no args": 
            if(!isSlash)username = message.author.id;
            else username = message.user.id;
            isAuthor = true;

        default:

            
            
            if(username === author.id)isAuthor = true;
            
            if(username === args0 && isSlash && args[0].name === "roblox_username"){
                
                id = await noblox.getIdFromUsername(username).catch(e=>id = 0);
                if(!id){
                    let robloxUsername = await noblox.getUsernameFromId(username).catch(e=>id = 0);
                    if(robloxUsername)username = args0;
                }
                break;
            }
                        
            status = 1;
            res = await rover(username).catch(err => status = 0);
            if(!status){
                if(isAuthor){
                    const embed = makeEmbed("User not found", `**You're not verfied**\n please connect your Roblox account using \`${server.prefix}verify\` or enter your roblox username like this: \`${server.prefix}check [Roblox username or ID]\``,server);
                    sendAndDelete(message, embed, server);
                    return true;
                }else{
                    const embed = makeEmbed("User not found", "Couldn't find the Roblox profile of this Discord account because the user isn't verified",server);
                    sendAndDelete(message, embed, server);
                    return true;
                }
                
            }
    }
    
    if(!res)res = {status: "e"};

    let ownedGamepassesInV2 = {};
    let ownedGamepassesInV1 = {};
    let power = {
        1: 0,
        2: 0,
    }
    let gamepassOwnership = {};

    const gamepasses = read("./[TSU]_Raider_Tracker/gamepasses.json");

    let gamepassIdsMS1 = [];
    for (const i in gamepasses["MS1"]) gamepassIdsMS1.push(gamepasses["MS1"][i].id);
    let gamepassIdsMS2 = [];
    for (const i in gamepasses["MS2"]) gamepassIdsMS2.push(gamepasses["MS2"][i].id);

    let {robloxUsername, robloxId} = res;
    let isKnown = true;

    if(res.status === "ok" || id ){
        
        
        if(!id)id = robloxId;
        if(!robloxUsername) robloxUsername = args0;
        
        let isBanned = false;

        gamepassOwnership = await Promise.all(gamepassIdsMS2.map(gamepassId => noblox.getOwnership(id, gamepassId, "GamePass").catch(e=>erroredOut = true))).catch(e=>isBanned = true);
        if(isBanned){
            const embed = makeEmbed("User not found", "Couldn't find a roblox user with this username/id\nOr the user could be banned from Roblox",server);
            if(isSlash)message?.editReply({embeds: [embed]});
            else  message.reply({embeds: [embed]});
            return true
        }
        let i = 0;

        for(let gamepassName in gamepasses["MS2"]){
            ownedGamepassesInV2[gamepassName] = gamepassOwnership[i];
            i++;
        }
    
        gamepassOwnership = await Promise.all(gamepassIdsMS1.map(gamepassId => noblox.getOwnership(id, gamepassId, "GamePass").catch(e=>erroredOut = true))).catch(e=>isBanned = true);
        if(isBanned){
            const embed = makeEmbed("User not found", "Couldn't find a roblox user with this username/id\nOr the user could be banned from Roblox",server);
            if(isSlash)message?.editReply({embeds: [embed]});
            else  message.reply({embeds: [embed]});
            return true
        }
        i = 0;
        
        for(let gamepassName in gamepasses["MS1"]){
            ownedGamepassesInV1[gamepassName] = gamepassOwnership[i];
            i++;
        }

        
        
        for(let gamepassName in ownedGamepassesInV1){

            const gamepassOwned = ownedGamepassesInV1[gamepassName];
            if(gamepassOwned)power[1] += gamepasses.MS1[gamepassName].power;
            
        }
        for(let gamepassName in ownedGamepassesInV2){

            const gamepassOwned = ownedGamepassesInV2[gamepassName];
            if(gamepassOwned)power[2] += gamepasses.MS2[gamepassName].power; 
        }


    } else isKnown = false;

        let v1Gamepasses = [];
        let v2Gamepasses = [];
        for(let gamepassName in gamepasses["MS1"]){
            v1Gamepasses.push({name:gamepassName, id:gamepasses["MS1"][gamepassName].id, power:gamepasses["MS1"][gamepassName].power});
        }
        for(let gamepassName in gamepasses["MS2"]){
            v2Gamepasses.push({name:gamepassName, id:gamepasses["MS2"][gamepassName].id, power:gamepasses["MS2"][gamepassName].power});
        }
        
        const filter = button =>  button.user.id === author.id;
    
        let iterV1 = v1Gamepasses.length / 10;
        let viewArrayV1 = [];
        for (let i = 0; i < iterV1; i++) {
            let shit = v1Gamepasses;
            let poopArray = shit.slice(i * 10, i*10+10);
            let embedFields =[]; 
            poopArray.forEach(obj=>embedFields.push({name:obj.name,value:`Id: ${obj.id}\nLink: [Gamepass](https://www.roblox.com/game-pass/${obj.id})\nPower: ${isKnown && obj.power}\nOwned: ${ownedGamepassesInV1[obj.name] ? "✅" : "❌"}`, inline:true}));
            viewArrayV1.push(embedFields); 
        }
        let iterV2 = v2Gamepasses.length / 10;
        let viewArrayV2 = [];
        for (let i = 0; i < iterV2; i++) {
            let shit = v2Gamepasses;
            let poopArray = shit.slice(i * 10, i*10+10);
            let embedFields =[]; 
            poopArray.forEach(obj=>embedFields.push({name:obj.name,value:`Id: ${obj.id}\nLink: [Gamepass](https://www.roblox.com/game-pass/${obj.id})\nPower: ${isKnown && obj.power}\nOwned: ${ownedGamepassesInV2[obj.name] ? "✅" : "❌"}`, inline:true}));
            viewArrayV2.push(embedFields); 
        }
        let index = 0
        let viewArray = viewArrayV1;
        let mode = 1;
    
        const embed = makeEmbed(`Military simulator gamepasses`,`${robloxUsername && isKnown ? "Showing MS1 gamepasses of " + robloxUsername : "Showing MS1 gamepasses"}`,server);
        embed.addFields(viewArray[index]);
        embed.setThumbnail(icons[mode]);
        if(isKnown)embed.setFooter({text: `Uncapped raider power for MS${mode}: ${power[mode]}`})
        
        
        let newMsg;
        if(!isSlash)newMsg = await message.reply({embeds:[embed], components: [row]});
        else newMsg = await message.editReply({embeds:[embed], components: [row]});
    
        const collector = newMsg.createMessageComponentCollector({ filter, time:   20 * 1000 });
        
    
        collector.on('collect', async i => {
    
            if(i.customId === "next"){
                
                collector.resetTimer();
                index++;
                
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
    
                embed.setFields(viewArray[index]);
                i.update({embeds:[embed],  components: [row]});
            } else if(i.customId === "previous"){
                
                collector.resetTimer();
                index--;
                
                
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
                embed.setFields(viewArray[index]);
                i.update({embeds:[embed],  components: [row]});
            } else if(i.customId === "switch"){
                collector.resetTimer();
                index = 0;
                if(mode === 1){
                    viewArray = viewArrayV2;
                    mode = 2;
                } else {
                    viewArray = viewArrayV1;
                    mode = 1;
                }
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
                embed.setFields(viewArray[index]);
                embed.setDescription(`${robloxUsername  && isKnown? "Showing MS"+mode+" gamepasses of " + robloxUsername : "Showing MS1 gamepasses"}`)
                embed.setThumbnail(icons[mode]);
                if(isKnown)embed.setFooter({text: `Uncapped raider power for MS${mode}: ${power[mode]}`})
                i.update({embeds:[embed],  components: [row]});
    
            }
            
        }); 
    
        collector.on('end', collected => {
            if(isSlash) message.editReply({components:[]}).catch(e=>e);
            else newMsg.edit({components:[]}).catch(e=>e);
        });

        
    
    

    
    
    

}


module.exports =raiders; 