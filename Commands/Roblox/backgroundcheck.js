const Command = require("../../Classes/Command");
const client = require("../../index");
const makeEmbed = require("../../functions/embed");
const checkUser = require("../../functions/checkUser");
const sendAndDelete = require("../../functions/sendAndDelete");
const botCache = require("../../caches/botCache");
const checkQueue = require("../../functions/checkQueue");


//queue


let bgcheck = new Command("bgcheck");
bgcheck.set({
    aliases         : ["backgroundcheck","bcheck", "bgc"],
    description     : "Shows the user's TSU profile and status",
    usage           : "bgcheck <roblox username or ID>",
    cooldown        : 22,
    unique          : true,
    category        : "roblox",
    worksInDMs      : false,
    isDevOnly       : false,
    isSlashCommand  : true,
    options			: [{
		name : "roblox_username",
		description : "The Roblox username to background check.",
		required : false,
		autocomplete: false,
		type: 3,
		},{
        name : "discord_username",
        description : "Background check for the Roblox account of a Discord user.",
        required : false,
        autocomplete: false,
        type: 6,
        }
	],
    
});

bgcheck.execute = async (message, args, server, isSlash, ) =>{

    if(isSlash)await message.deferReply().catch(e=>console.log(e));

    let isAuthor = false;
    
    const date1 = Date.now()

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

    
    /*if(client.user.id !== "799752849163550721"){
        const embed = makeEmbed('Command unavailable',"This command is not available on this client.", server);
        sendAndDelete(message,embed,server);
        return false;
    } else {*/
        let sentMessage;
        if(!isSlash) sentMessage = await message.reply("CrazyBot is waiting in queue...");


        await checkQueue()

        await sentMessage?.edit("CrazyBot is collecting data from Roblox...").catch(e=>e);

        const queueTime = parseInt((Date.now() - date1) / 1000); 

        botCache.isOnRobloxCooldown = true;
        
        try {

            await require("../../[TSU]_Background_Checker/backGroundCheck")(message, args, server, isSlash, res, status, id, username, args0, author, isAuthor, sentMessage, queueTime);
        } catch (error) {

            console.log(error)

        } finally{

            setTimeout(()=>{
                botCache.isOnRobloxCooldown = false;
            },7500);
        }
       
        return true;

    //}
};



module.exports = bgcheck;