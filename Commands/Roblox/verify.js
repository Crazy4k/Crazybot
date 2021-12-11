const Command = require("../../Classes/Command");
const rover = require("rover-api");
const makeEmbed = require("../../functions/embed");



let check = new Command("verify");
check.set({
    aliases         : [],
    description     : "Connects Roblox user with discord user using Rover",
    usage           : "verify",
    cooldown        : 5,
    unique          : false,
    category        : "roblox",
    worksInDMs      : true,
    isDevOnly       : false,
    isSlashCommand  : true,
    
});

check.execute = async (message, args, server) =>{

    let isVerified = true;
    let authorId;
    if(message.type === "APPLICATION_COMMAND")authorId = message.user.id;
    else authorId = message.author.id;
    const robloxBody = await rover(authorId).catch(err => isVerified = false);
    let embed;

    if(isVerified){
        embed = makeEmbed(`Welcome back, ${robloxBody.robloxUsername}`,`Click [HERE](https://rover.link/my/verification) to modify and control your linked account!`,server,false,"Powered by Rover.link");
        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${robloxBody.robloxId}&width=420&height=420&format=png`);
    } else{
        embed = makeEmbed(`Hello there!`,`Click [HERE](https://rover.link/my/verification) to verify and link your Roblox account!\n After you've verified, your Roblox account will be connected to your Discord account.`,server,false,"Powered by Rover.link");
        embed.setImage("https://cdn.discordapp.com/attachments/867797536223133706/901473724614713414/image0.png");
    }

    message.reply({embeds: [embed]}).catch(err=>err);
    return true;

};

module.exports = check;