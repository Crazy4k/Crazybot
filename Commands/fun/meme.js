/*const axios = require('axios');
const makeEmbed = require("../../functions/embed");
const Command = require("../../Classes/Command");
const {MessageActionRow, MessageButton} = require("discord.js");

//API USED: https://some-random-api.ml/meme

let meme = new Command("meme");
meme.set({
    
	aliases         : [],
	description     : "Sends a random meme",
	usage           : "meme",
	cooldown        : 15,
	unique          : false,
	category        : "fun",
	requiredPerms	: "EMBED_LINKS",
	worksInDMs      : true,
	isDevOnly       : false,
	isSlashCommand  : true
})


meme.execute = async (message, args, server, isSlash) => {
	

	const nextMemeButton = new MessageButton()
	.setCustomId('meme')
	.setLabel('Next meme')
	.setStyle('PRIMARY')
	const endInteractionButton = new MessageButton()
	.setCustomId('end')
	.setLabel('End interaction')
	.setStyle('SECONDARY')
	let row = new MessageActionRow().addComponents(nextMemeButton, endInteractionButton);

	let author;
	if(isSlash)author = message.user;
	else author = message.author;


	const filter = button =>  button.user.id === author.id;

	const embed = makeEmbed("meme","",server,false,"")


	let res = await axios.get('https://some-random-api.ml/meme').catch(err=>console.log(err));
	embed.setImage(res.data.image);
    embed.setTitle(res.data.caption);

	let newMsg = await message.reply({embeds:[embed], components: [row]});
	if(isSlash) newMsg = await message.fetchReply();

	const collector = newMsg.createMessageComponentCollector({ filter, time:   20 * 1000 });
	collector.on('collect', async i => {
		if(i.customId === "meme"){
			collector.resetTimer();
            let res = await axios.get('https://some-random-api.ml/meme').catch(err=>console.log(err));
            embed.setImage(res.data.image);
            embed.setTitle(res.data.caption);
			i.update({embeds:[embed]});
		} else if(i.customId === "end"){
			i.update({components:[]});
		}
		
		
	});
	collector.on('end', collected => {
		if(isSlash) message.editReply({components:[]}).catch(e=>e);
		else newMsg.edit({components:[]}).catch(e=>e);
	});



	
}

module.exports = meme;*/