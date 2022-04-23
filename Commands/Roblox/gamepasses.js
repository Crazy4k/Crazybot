const makeEmbed = require("../../functions/embed");
const Command = require("../../Classes/Command");
const {MessageActionRow, MessageButton} = require("discord.js");
const fs = require("fs")

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
	aliases         : ["gamepass","gp"],
	description     : "Shows the saved MS gamepasses.",
	usage           : "gamepasses",
	cooldown        : 5,
	unique          : false,
	category        : "roblox",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true
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

    let author;
    if(isSlash)author = message.user;
    else author = message.author;

    const gamepasses = read("./raiderTracker/gamepasses.json");

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
        poopArray.forEach(obj=>embedFields.push({name:obj.name,value:`Id: ${obj.id}\nLink: [Gamepass](https://www.roblox.com/game-pass/${obj.id})\nPower: ${obj.power}`, inline:true}));
        viewArrayV1.push(embedFields); 
    }
    let iterV2 = v2Gamepasses.length / 10;
    let viewArrayV2 = [];
    for (let i = 0; i < iterV2; i++) {
        let shit = v2Gamepasses;
        let poopArray = shit.slice(i * 10, i*10+10);
        let embedFields =[]; 
        poopArray.forEach(obj=>embedFields.push({name:obj.name,value:`Id: ${obj.id}\nLink: [Gamepass](https://www.roblox.com/game-pass/${obj.id})\nPower: ${obj.power}`, inline:true}));
        viewArrayV2.push(embedFields); 
    }
    let index = 0
    let viewArray = viewArrayV1;
    let mode = 1;

    const embed = makeEmbed(`Military simulator gamepasses`,"Showing MS1 gamepasses",server);
    embed.addFields(viewArray[index]);
    embed.setThumbnail(icons[mode]);
    
    

    let newMsg = await message.reply({embeds:[embed], components: [row]});
    if(isSlash) newMsg = await message.fetchReply();

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
            embed.setDescription(`Showing MS${mode} gamepasses`)
            embed.setThumbnail(icons[mode]);
            i.update({embeds:[embed],  components: [row]});

        }
        
    }); 

    collector.on('end', collected => {
        if(isSlash) message.editReply({components:[]}).catch(e=>e);
        else newMsg.edit({components:[]}).catch(e=>e);
    });
    

}


module.exports =raiders; 