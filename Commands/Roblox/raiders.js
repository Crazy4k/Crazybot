const makeEmbed = require("../../functions/embed");
const botCache = require("../../caches/botCache");
const noblox = require("noblox.js");
const Command = require("../../Classes/Command");

function whatPlace( id){
    let str = ""
    switch (id) {
        
        case "2988554876":
            str = "MS1 border"
            break;
        case "3145176353":
            str = "MS1 City"
            break;
        case "4454445210":
            str = "MS1 Apartments"
            break;
        case "4146579025":
            str = "MS1 Palace"
            break;
        case "4771888361":
            str = "MS2 border"
            break;
        case "5103000243":
            str = "MS2 city"
            break;
    
        default:
            str = "Unknown"
            break;
    }
    return str;

}
function splitId(string){
    return string.split(" ");
}
let raiders = new Command("raiders");

raiders.set({
	aliases         : ["trackraiders"],
	description     : "Shows you the current trackalbe raiders that are playing MS.",
	usage           : "raiders",
	cooldown        : 2,
	unique          : false,
	category        : "roblox",
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : true
});

    
    raiders.execute = async function(message, args, server){ 

    if(Object.values(botCache.raiderCache).length){

        const embed = makeEmbed("Raider tracker.","", server);
        
        
        let shittyStr = [];
        for( let e in botCache.raiderCache){
            let shit = splitId( botCache.raiderCache[e]);
            //let rootPlaceId = shit[0];
            let placeId = shit[1];
            //let instantlink = shit[2];
            let placeString = whatPlace(placeId);
            if(shit){
                let name = await noblox.getUsernameFromId(e)
                shittyStr.push(`[${name}](https://www.roblox.com/users/${e}/profile) is playing [${placeString}](https://www.roblox.com/games/${placeId}).`);
            }

        }
        if(shittyStr.length){
            embed.setDescription(`**These are the trackable raiders that are playing MS right now.**\n\n${shittyStr.join("\n")}`);
            message.reply({embeds: [embed]});
            return true;
        }else {
            const embed = makeEmbed("No raiders.","These are currently no trackable raiders playing ms.", server);
            message.reply({embeds: [embed]});
            return true;
        }
        
    
    } else {
        const embed = makeEmbed("No raiders.","These are currently no trackable raiders playing ms.", server);
        message.reply({embeds: [embed]});
        return true;

    }
    

    



}


module.exports =raiders; 