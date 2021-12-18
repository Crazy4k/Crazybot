
const Command = require("../../Classes/Command");
const {MessageActionRow, MessageButton} = require("discord.js");

let avatar = new Command("invite");

avatar.set({
	aliases         : [],
	description     : "Invites you to the bot's discord server",
	usage           : "invite",
	cooldown        : 3,
	unique          : false,
	category        : "other",
	whiteList       : null,
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true,
	
});

avatar.execute =  function(message, args, server, isSlash) {
	
    const invite = new MessageButton()
    .setLabel('Invite the bot')
    .setStyle('LINK')
    .setURL("https://top.gg/bot/799752849163550721")
  
    let row = new MessageActionRow().addComponents(invite,);



	message.reply({content: "Here is the invite for our Discord server!\nhttps://discord.gg/vSFp7SjHWp", components: [row]});
}

module.exports = avatar;