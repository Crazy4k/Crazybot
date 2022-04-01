const makeEmbed = require("../../functions/embed");
const Command = require("../../Classes/Command");
const fs = require("fs");
const noblox = require("noblox.js");
const {bot_info} = require("../../config/config.json");
const sendAndDelete = require("../../functions/sendAndDelete");
const authorID = bot_info.authorID;


function read(string){
    let obj =  fs.readFileSync(string, "utf-8");
    return JSON.parse(obj); 
}


function write(obj, string){

    let stringObj = JSON.stringify(obj, null, 2);

    fs.writeFile(string, stringObj ,(err, config)=>{
      if(err) {
        console.log(err);
      }
      else {
        console.log("UPDATED TRACKED GROUPS");
      }
    });

}




let devgamepasses = new Command("devgamepasses");

devgamepasses.set({
	aliases         : ["devpasses"],
	description     : "[DEV_ONLY] adds/removes and shows the current TSU gamepasses stored in the bot's JSON file",
	usage           : "devgamepasses [action] [Gamepass id] [MS2 || MS1] [power] [gamepass name] ",
	cooldown        : 5,
	unique          : false,
	category        : null,
	worksInDMs      : false,
	isDevOnly       : true,
});

    
devgamepasses.execute = async function(message, args, server, isSlash){ 

    if (message.author.id !== authorID) return false

    const gamepassesJSON = read("./raiderTracker/gamepasses.json");

    if(args[0] === "add"){
        let erroredOut = false;
        
        
        const id = parseInt(args[1]);
        const index = args[2]?.toUpperCase();
        const power = args[3];
        const name = args.splice(4).join(" ");


        if(!id){
            const em = makeEmbed("No id",`You didnt specify a gamepass id to add`,server);
            sendAndDelete(message, em, server);
            return false;
        }
        
        if(index !== "MS2" && index !== "MS1"){
            const em = makeEmbed("Destinication undefined",`Please provide which game this gamepass belongs to next time\n\`${server.prefix}${this.usage}\``,server);
            sendAndDelete(message, em, server);
            return false;
        }
        if(!power){
            const em = makeEmbed("Missing power",`Please provide power for your gamepass\n\`${server.prefix}${this.usage}\``,server);
            sendAndDelete(message, em, server);
            return false;
        }
        if(!name){
            const em = makeEmbed("Missing name",`Please provide a name for your gamepass\n\`${server.prefix}${this.usage}\``,server);
            sendAndDelete(message, em, server);
            return false;
        }
        const gamepasses = await noblox.getGamePasses(1078767831).catch(e=> {erroredOut = true;console.log(e);});


        if(erroredOut){
            const em = makeEmbed("An error happened","Couldn't get group name and info",server);
            sendAndDelete(message,em,server);
            return false;
        }

        let doesExist = false;

        for(let i of gamepasses){
            if(i.id === id){
                doesExist = true;
            }
        }

        if(!doesExist){
            const em = makeEmbed("","This gamepass is not a TSU gamepass",server);
            sendAndDelete(message,em,server);
            return false;
        }

        for(let passName in gamepassesJSON[index]){
            const pass = gamepassesJSON[index][passName];

            if(pass.id === id){
                const em = makeEmbed("Pass already exists","This gamepass already exists in the raider tracker file. Consider removing it instead.",server);
                sendAndDelete(message,em,server);
                return false;
            }
            
        }

        gamepassesJSON[index][name] = {
            id,
            power
        }


        write(gamepassesJSON, "./raiderTracker/gamepasses.json");

        const embed = makeEmbed("Gamepass added",`${name} has been added gamepasses list.`, server)
        message.reply({embeds:[embed]});
        return true; 

    } else if(args[0] === "remove"){
        
        
        

        const id = parseInt(args[1]);
        const index = args[2]?.toUpperCase();
        let passToremove;
        

        if(!args[1]){
            const em = makeEmbed("No Gamepass?","You didnt specify a gamepass to remove",server);
            sendAndDelete(message,em,server);
            return false;
        }
        if(index !== "MS2" && index !== "MS1"){
            const em = makeEmbed("Destinication undefined",`Please provide which game this gamepass belongs to next time\n\`${server.prefix}${this.usage}\``,server);
            sendAndDelete(message, em, server);
            return false;
        }

        let name;
        for(let passName in gamepassesJSON[index]){
            const pass = gamepassesJSON[index][passName];
            if(pass.id === id){
                passToremove = pass;
                name = passName;
            }

        }

        if(!passToremove){
            const em = makeEmbed("There is no such Gamepass!","This pass isn't in the bot in the first place. Consider using `add` instead.",server);
            sendAndDelete(message,em,server);
            return false;
        }

        
        delete gamepassesJSON[index][name]


        write(gamepassesJSON, "./raiderTracker/gamepasses.json");

        const embed = makeEmbed("Gamepass removed",`${name} has been removed from passes list.`, server)
        message.reply({embeds:[embed]});
        return true;

    } else {
        const embed = makeEmbed(`bozo`,`I didn't code \`;gamepasses\` for nothing`,server);
        message.reply({embeds:[embed]});
        return true;
    }
    
}


module.exports = devgamepasses; 