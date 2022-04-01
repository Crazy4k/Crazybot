
const {bot_info} = require("../../config/config.json");
const authorID = bot_info.authorID;
const makeEmbed = require("../../functions/embed");
const client = require("../../index");
const botCache = require("../../caches/botCache");
const Command = require("../../Classes/Command");


let evalCommand = new Command("cache");
evalCommand.set({
	aliases         : [],
	description     : "[DEV_ONLY] Shows the dev the bot's cache.",
	usage           : "cache",
	cooldown        : null,
	unique          : false,
	category        : null,
	whiteList       : null,
	worksInDMs      : true,
	isDevOnly       : true,
	isSlashCommand  : false
})

evalCommand.execute = async function (message, args, server) {

    if (message.author.id !== authorID) return false;
    
    try {
       let embed = makeEmbed("Bot's cache!","",server,);
       embed.addFields(
           {name:"servers database-cached",value: `${Object.values(botCache.guildsCache).length}`,inline:true},
           {name:"server points cached",value: `${Object.values(botCache.pointsCache).length}`,inline:true},
           {name:"tracked raider",value: `${botCache.trackedRaiders.length}`,inline:true},
           {name:"database total fetches",value: `${botCache.fetchesCache.totalFetches}`,inline:true},
           {name:"Users cached",value: `${client.users.cache.size}`,inline:true},
           {name:"guilds cached",value: `${client.guilds.cache.size}`,inline:true},
           {name:"Channels cached",value: `${client.channels.cache.size}`,inline:true},
           {name:"Commands executed",value: `${JSON.stringify(botCache.executes)}`,inline:true},
       )
        
        
       
        client.users.cache.get(authorID).send({embeds:[embed]});
    } catch (error) {
        const embed2 = makeEmbed("Error!", `${error}`, "CF1300",);
        message.channel.send({embeds: [embed2]});
        console.error(error);
    }
}

module.exports = evalCommand;


