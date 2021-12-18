const Command = require("../../Classes/Command");
const {MessageActionRow, MessageButton} = require("discord.js");

let ping = new Command("ping");
ping.set({
    aliases: [],
    description         : "Replies with pong",
    cooldown            : 0,
    category            : "other",
    whiteList           : false,
    unique              : false,
    worksInDMs          : true,
    isDevOnly           : false,
    isSlashCommand      : true,
    isTestOnly          : false,
    usage               : "ping"
})
ping.execute =async  function(message, args, server, isSlash){

    const button = new MessageButton()
    .setCustomId('primary')
    .setLabel('button wow 😱')
    .setStyle('PRIMARY')
    let row = new MessageActionRow().addComponents(button);

    let author;
    if(isSlash)author = message.user;
    else author = message.author;


    const filter = button => button.customId === 'primary' && button.user.id === author.id;

    

    let newMsg = await message.reply({content :"pong", components: [row]})
    if(isSlash) newMsg = await message.fetchReply();


    newMsg.awaitMessageComponent({ filter, time: 380, max : 1 })
        .then( interaction =>{
           if (interaction.customId === 'primary') {
               
            interaction.update({content: "WOW YOU CLICKED THE BUTTON 🥶",components:[]});
           }
        })
        .catch(e=> {
            if(isSlash) message.editReply({components:[]});
            else newMsg.edit({components:[]});
        })
    
    return true;
}

module.exports = ping;