const makeEmbed = require("../../functions/embed");
const Command = require("../../Classes/Command");
const fs = require("fs");
const getMembers = require("../../[TSU]_Raider_Tracker/getMembers");
const {bot_info} = require("../../config/config.json");
const authorID = bot_info.authorID;
let botCache = require("../../caches/botCache");
const sendAndDelete = require("../../functions/sendAndDelete");

function read(string){
    let obj =  fs.readFileSync(string,"utf-8");
    return JSON.parse(obj); 
}




let updateraidertracker = new Command("updateraidertracker");

updateraidertracker.set({
	aliases         : ["updatert","updatetracker","updateraiders","upd8rt"],
	description     : "[DEV_ONLY] Forces a fetch and updates raider tracker data according to the JSON file. (adds newly joined members and such)",
	usage           : "updateraidertracker",
	cooldown        : 5,
	unique          : false,
	category        : null,
	worksInDMs      : false,
	isDevOnly       : true,
});

    
updateraidertracker.execute = async function(message, args, server, isSlash){ 

    if (message.author.id !== authorID) return false



    const raiderGroupsJSON = read("./[TSU]_Raider_Tracker/raiderGroups.json");

    if(!raiderGroupsJSON?.length){
        const em = makeEmbed("Command failed","An error happened, try again later.",server);
        sendAndDelete(message,em,server);
        return false;
    }
    

    let groupsArray =  []
    for(let group of raiderGroupsJSON){
        groupsArray.push(group.id)
    }
    let groups = await getMembers(groupsArray);

    if(!groups.length){
        const em = makeEmbed("Command failed","An error happened, try again later.",server);
        sendAndDelete(message,em,server);
        return false;
        
    }

    console.log("raiderGroupsJSON.length",raiderGroupsJSON.length);
    console.log("groups.length",groups.length);

    groups = [...new Set(groups)];
    botCache.trackedRaiders = groups

    console.log("UPDATED THE RAIDER CACHE")

    const embed = makeEmbed("","Updated raider tracker info!", server)
    message.reply({embeds:[embed]});
    
}


module.exports = updateraidertracker; 