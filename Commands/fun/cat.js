const axios = require('axios');
const makeEmbed = require("../../functions/embed");
const Command = require("../../Classes/Command");
const {MessageActionRow, MessageButton} = require("discord.js");

//API USED: https://thecatapi.com

let cat = new Command("cat");
cat.set({
    
	aliases         : ["meow","pussy","furr","kitty"],
	description     : "Sends a random cat pic.",
	usage           : "cat",
	cooldown        : 30,
	unique          : false,
	category        : "fun",
	requiredPerms	: "EMBED_LINKS",
	worksInDMs      : true,
	isDevOnly       : false,
	isSlashCommand  : true
})


cat.execute = async (message, args, server, isSlash) => {
	

	const nextCatButton = new MessageButton()
	.setCustomId('cat')
	.setLabel('Next cat 🐱')
	.setStyle('PRIMARY')
	const endInteractionButton = new MessageButton()
	.setCustomId('end')
	.setLabel('End interaction')
	.setStyle('SECONDARY')
	let row = new MessageActionRow().addComponents(nextCatButton, endInteractionButton);

	let author;
	if(isSlash)author = message.user;
	else author = message.author;


	const filter = button =>  button.user.id === author.id;

	const embed = makeEmbed("The Cat API","",server,false,"")
	embed.setURL("https://thecatapi.com");


	let res = await axios.get('https://api.thecatapi.com/v1/images/search?api_key= key goes here ').catch(err=>console.log(err));
	embed.setImage(res.data[0].url);

	let newMsg = await message.reply({embeds:[embed], components: [row]});
	if(isSlash) newMsg = await message.fetchReply();

	const collector = newMsg.createMessageComponentCollector({ filter, time: 3 * 60 * 1000 });
	collector.on('collect', async i => {
		if(i.customId === "cat"){
			let res = await axios.get('https://api.thecatapi.com/v1/images/search?api_key= key goes here ').catch(err=>console.log(err));
			embed.setImage(res.data[0].url);
			i.update({embeds:[embed]});
		} else if(i.customId === "end"){
			i.update({components:[]});
		}
		
		
	});
	collector.on('end', collected => {
		if(isSlash) message.editReply({components:[]});
		else newMsg.edit({components:[]});
	});



	
}

module.exports = cat;