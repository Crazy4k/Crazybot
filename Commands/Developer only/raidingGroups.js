const makeEmbed = require("../../functions/embed");
const Command = require("../../Classes/Command");
const fs = require("fs");
const noblox = require("noblox.js");
const {bot_info} = require("../../config/config.json");
const sendAndDelete = require("../../functions/sendAndDelete");
const authorID = bot_info.authorID;


function read(){
    let obj =  fs.readFileSync("./[TSU]_Raider_Tracker/raiderGroups.json","utf-8");
    return JSON.parse(obj); 
}


function write(obj){
    let stringObj = JSON.stringify(obj, null, 2);

    fs.writeFile("./[TSU]_Raider_Tracker/raiderGroups.json",stringObj ,(err, config)=>{
      if(err) {
        console.log(err);
      }
      else {
        console.log("UPDATED TRACKED GROUPS");
      }
    });

}




let raidinggroups = new Command("raidinggroups");

raidinggroups.set({
	aliases         : ["aosgroups","kosgroups","kosgrps","aosgrps"],
	description     : "[DEV_ONLY] adds/removes and shows the current tracked groups in the raider tracker.",
	usage           : "raidinggroups [action] [group link]",
	cooldown        : 5,
	unique          : false,
	category        : null,
	worksInDMs      : false,
	isDevOnly       : true,
});

    
raidinggroups.execute = async function(message, args, server, isSlash){ 

    if (message.author.id !== authorID) return false

    const groups = read();

    if(args[0] === "add"){
        let erroredOut = false;
        
        if(!args[1]){
            const em = makeEmbed("No group","You didnt specify a group to add",server);
            sendAndDelete(message,em,server);
            return false;
        }
        const groupToAdd = await noblox.getGroup(args[1]).catch(e=> erroredOut = true);

        if(erroredOut){
            const em = makeEmbed("An error happened","Couldn't get group name and info",server);
            sendAndDelete(message,em,server);
            return false;
        }
        for(let i of groups){
            if(`${i.id}` === args[1]){
                const em = makeEmbed("Group already exists","This group already exists in the raider tracker file. Consider removing it instead.",server);
                sendAndDelete(message,em,server);
                return false;
            }
        }

        groups.push({
            name: groupToAdd.name,
            id:  groupToAdd.id,
            link: `https://www.roblox.com/groups/${groupToAdd.id}`,
            status: args[2] ?? "KoS"
        })

        write(groups);

        const embed = makeEmbed("Group added!",`${groupToAdd.name} has been added to the raider tracker. Consider refreshing the list manually now.`, server)
        message.reply({embeds:[embed]});
        return true;

    } else if(args[0] === "remove"){
        
        
        if(!args[1]){
            const em = makeEmbed("No group","You didnt specify a group to remove",server);
            sendAndDelete(message,em,server);
            return false;
        }

        let groupToRemove;
        let index;

        for (let i = 0; i < groups.length; i++) {
            const element = groups[i];
            if(element.id === parseInt(args[1])){
                groupToRemove = element;
                index = i;
            }
            
        }
        if(!groupToRemove){
            const em = makeEmbed("There is no such group!","This group isn't tracker in the first place. Consider using `add` instead.",server);
            sendAndDelete(message,em,server);
            return false;
        }

        
        groups.splice(index, 1);


        write(groups);

        const embed = makeEmbed("Group removed!",`${groupToRemove.name} has been removed from the raider tracker. Consider refreshing the list manually now.`, server)
        message.reply({embeds:[embed]});
        return true;

    } else {
        const embed = makeEmbed(`Tracked groups`,"Showing Currect registered groups in the raider tracker",server);
    
        groups.forEach(obj=>embed.addField(`${obj.name}`, `Id: ${obj.id}\nStatus: ${obj.status}\nLink: [LINK](${obj.link})`,true));
        
        await message.reply({embeds:[embed]});
        return true;
    }
    
}


module.exports = raidinggroups; 