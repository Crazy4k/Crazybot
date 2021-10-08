/*//oooooooooooooo here we go 
const sendAndDelete = require("../../functions/sendAndDelete");
const makeEmbed = require("../../functions/embed");
const noblox = require("noblox.js");
const colors = require("../../colors.json");
const client = require("../../index");

module.exports = {
	name : 'check',
	description : 'Sends a user\'s TSU groups',
	usage:'check [roblox username or roblox ID]',
	cooldown: 4,
	category:"ms",
	async execute(message, args, server) {
		
        let robloxUserName = args[0];
        if(!robloxUserName)robloxUserName = message.guild.members.cache.get(message.author.id).displayName;


        let robloxPlayerId = await noblox.getIdFromUsername(robloxUserName).catch(e=>{
            const embed = makeEmbed(`Invalid username`,`**"${robloxUserName}" is not a valid roblox username.**`, colors.failRed);
            sendAndDelete(message,embed,server);
            return false;
        })
        if(!robloxPlayerId)return false;


        const embed = makeEmbed("Showing user's identity.","",server)
        embed.setAuthor("Check commnad",client.user.displayAvatarURL())
        console.log(robloxPlayerId);
        return true;


		
		
	},

};
*/