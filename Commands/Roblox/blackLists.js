const Command = require("../../Classes/Command");
const getRobloxData = require("../../functions/getRobloxData");
const makeEmbed = require("../../functions/embed");
const checkUser = require("../../functions/checkUser");
const noblox = require("noblox.js");
const sendAndDelete = require("../../functions/sendAndDelete");
const botCache = require("../../caches/botCache");
const {MessageActionRow, MessageButton} = require("discord.js");
const { default: axios } = require("axios");

require("dotenv").config();
const token = process.env.TRELLO_TOKEN;
const key = process.env.TRELLO_KEY;

let trelloInfo = {
    key,
    token,
    blackListBoardId : "5f5240eb7d10715ed708c8ae",
    kgbTrelloId: "60239dcea166e18eca0f89ea"

}

const cache = {

}




let check = new Command("blacklists");
check.set({
    aliases         : ["bl","blacklist", "black-lists", "black-list"],
    description     : "Shows the user's TSU blacklists",
    usage           : "blacklists <roblox username or ID>",
    cooldown        : 5,
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

check.execute = async (message, args, server, isSlash) =>{

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
                    let robloxUsername = botCache.usernamesCache[args0] ?? await noblox.getUsernameFromId(args0).catch(e=>id = 0);
                    if(robloxUsername){
                        id = args0;
                        botCache.usernamesCache[id] = robloxUsername;
                        
                    }
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
                res = await getRobloxData(username).catch(err => status = 0);
                
                if(!status){
                    if(isAuthor){
                        const embed = makeEmbed("User not found", `Could not identify your Roblox account because you're not verfied\n please connect your Roblox account using \`${server.prefix}verify\` or enter your roblox username like this: \`${server.prefix}check [Roblox username or ID]\``,server);
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

    if(res.status === "ok" || id ){

        let {cachedUsername, robloxId} = res;
        if(!id)id = robloxId;
        if(!cachedUsername) cachedUsername = args0;
        let erroredOut = false;
        
        
        const trelloData = await axios.get(`https://api.trello.com/1/search?query=${id}&idBoards=${trelloInfo.blackListBoardId}&modelTypes=cards&key=${trelloInfo.key}&token=${trelloInfo.token}`).catch(e=>erroredOut = true);
        
        if(erroredOut){
            const embed = makeEmbed("There was an error!", `An errored occoured while retreiving data from Trello, try again later`,server);
            pendingMessage?.delete().catch(e=>e);
            sendAndDelete(message, embed, server);
            return;                
        }

       
        const embed = makeEmbed(`Results for "${cachedUsername}" in the black list Trello`,"", server);
        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);


        const cards = [];
        for(let card of trelloData?.data?.cards){
            if(card?.name?.toLowerCase() === cachedUsername.toLowerCase() || card?.desc.includes(id)){
                let obj = {};
                let array = card.desc.split("\n");
                
                obj.div = array[0];
                obj.name = card.name;
                obj.url = card.url;
                obj.labels = [];
                card.labels.forEach(label=>{obj.labels.push(label.name)});

                const processingDes = card.desc.split(/ +/);
                const processedDes = [];
                let addNewLine = false;

                for (let i = 0; i < processingDes.length; i++) {
                    const word = processingDes[i];

                    if(addNewLine){
                        processedDes.push(" \n")
                        addNewLine = false;
                    } 
                    if(word.startsWith("https://"))addNewLine = true;
                    
                    processedDes.push(word);
                }
                
                obj.fullDescription = processedDes.join(" ");
                
                if(cache[card.idList])obj.list = cache[card.idList];
                else {
                    
                    const lists = await axios.get(`https://api.trello.com/1/boards/${card.idBoard}/lists?key=${trelloInfo.key}&token=${trelloInfo.token}`).catch(e=>erroredOut = true);

                    if(erroredOut){
                        const embed = makeEmbed("There was an error!", `An errored occoured while retreiving data from Trello, try again later`,server);
                        sendAndDelete(message, embed, server);
                        return;                
                    }

                    if(lists?.data){
                        for (const list of lists.data) {
                            cache[list.id] = list.name;
                        }
                    }
                    obj.list = cache[card.idList];
                }


                

                cards.push(obj);

                
            }
        }

        if(cards.length){
            
            
            const nextButton = new MessageButton()
            .setCustomId('next')
            .setEmoji("⏩")
            .setLabel('Next card')
            .setStyle('PRIMARY')
            const previousButton = new MessageButton()
            .setCustomId('previous')
            .setEmoji("⏪")
            .setLabel('Previous card')
            .setStyle('PRIMARY')
            .setDisabled();
            
            let row = new MessageActionRow().addComponents( previousButton,nextButton );
            const filter = button =>  button.user.id === author.id;
            
            let index = 0;
            let max = cards.length;

            embed.setDescription(`Displaying card ${index + 1} out of ${max} \n\n\n ${cards[index].fullDescription}`);
            embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);
            embed.setFields(
                {name: "\u200b", value: "\u200b", inline: false},
                {name: "Card URL", value: `[CLICK HERE](${cards[index].url})`, inline: true},
                {name: "list", value: cards[index].list, inline: true},
                {name: "Labels", value: cards[index].labels.length ? "**" + cards[index].labels.join("**, **") + "**" : "-" , inline: true},
            )
           

            
            if(index === cards.length - 1)nextButton.setDisabled(true);
            

            let newMsg;
            newMsg = await message.reply({embeds:[embed], components: [row]}).catch(e=>console.log(e));
            if(isSlash) newMsg = await message.fetchReply();

            const collector = newMsg.createMessageComponentCollector({ filter, time:   30 * 1000 });


            collector.on('collect', async i => {
    
                if(i.customId === "next"){
                    
                    collector.resetTimer();
                    index++;
                    
                    if(index === 0){
                        previousButton.setDisabled(true);
                    } else {
                        previousButton.setDisabled(false);
                    }
                    if(index === cards.length - 1){
                        nextButton.setDisabled(true);
                    } else {
                        nextButton.setDisabled(false);
                    }
        
                    embed.setDescription(`Displaying card ${index + 1} out of ${max} \n\n\n ${cards[index].fullDescription}`);
                    embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);
                    embed.setFields(
                        {name: "\u200b", value: "\u200b", inline: false},
                        {name: "Card URL", value: `[CLICK HERE](${cards[index].url})`, inline: true},
                        {name: " list", value: cards[index].list, inline: true},
                        {name: "Labels", value: cards[index].labels.length ? "**" + cards[index].labels.join("**, **") + "**" : "-", inline: true},
                    );


                    i.update({embeds:[embed],  components: [row]});
                } else if(i.customId === "previous"){
                    
                    collector.resetTimer();
                    index--;
                    
                    
                    if(index === 0){
                        previousButton.setDisabled(true);
                    } else {
                        previousButton.setDisabled(false);
                    }
                    if(index === cards.length - 1){
                        nextButton.setDisabled(true);
                    } else {
                        nextButton.setDisabled(false);
                    }
                    
                    embed.setDescription(`Displaying card ${index + 1} out of ${max} \n\n\n ${cards[index].fullDescription}`);
                    embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`);
                    embed.setFields(
                        {name: "\u200b", value: "\u200b", inline: false},
                        {name: "Card URL", value: `[CLICK HERE](${cards[index].url})`, inline: true},
                        {name: "list", value: cards[index].list, inline: true},
                        {name: "Labels", value: cards[index].labels.length ? "**" + cards[index].labels.join("**, **") + "**": "-", inline: true},
                    );


                    i.update({embeds:[embed],  components: [row]});
                } 
                
            }); 

            collector.on('end', collected => {
                if(isSlash) message.editReply({components:[]}).catch(e=>e);
                else newMsg.edit({components:[]}).catch(e=>e);
            });

        } else {

            embed.setDescription("`No results found for this user`");

            message.reply({embeds: [embed]});
            return true;
        }

        

    }

        

};
module.exports = check;