const Command = require("../../Classes/Command");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
const Discord = require("discord.js");

function isValidHex(color) {
    if(!color || typeof color !== 'string') return false;

    // Validate hex values
    if(color.substring(0, 1) === '#') color = color.substring(1);

    switch(color.length) {
      case 3: return /^[0-9A-F]{3}$/i.test(color);
      case 6: return /^[0-9A-F]{6}$/i.test(color);
      case 8: return /^[0-9A-F]{8}$/i.test(color);
      default: return false;
    }

    return false;
}


const embed = new Command("embed");

embed.set({
    aliases : [],
    description : "Constructs and send a discord embed in the channel.",
    cooldown : 3,
    category : "other",
    whiteList : "ADMINISTRATOR",
    unique : false,
    worksInDMs : false,
    isDevOnly : false,
    isSlashCommand :  true,
    isTestOnly : false,
    usage : "embed (embed Data in JSON) or /embed (simple way)",
    options: [
            {
                name : "title",
                description : "The title of your embed",
                required : true,
                type: 3,
            },
            {
                name : "description",
                description : "The description or text that is under the title",
                required : true,
                type: 3,
            },{
                name : "color",
                description : "A hexadecimal color value. Default is the server's embed color",
                required : false,
                type: 3,
            },
            {
                name : "footer",
                description : "A small text that can be found at the bottom of an embed",
                required : false,
                type: 3,
            },
            {
                name : "title-url",
                description : "A link that is clickable via the header",
                required : false,
                type: 3,
            },
            {
                name : "footer-image",
                description : "Image URL that is displayed next to the footer",
                required : false,
                type: 3,
            },
            {
                name : "image",
                description : "Image URL that is displayed at the middle of the embed",
                required : false,
                type: 3,
            },
            {
                name : "thumbnail",
                description : "Image URL that is displayed at the top right of the embed",
                required : false,
                type: 3,
            },
            {
                name : "author",
                description : "displays a user tag and avatar as the author of the embed",
                required : false,
                type: 6,
            },
            

    ]
});
embed.execute = function (message, args, server, isSlash){
    if(isSlash){
        let embed = makeEmbed(args[0].value,args[1].value, server, false,"");
        let footerText = "";
        for(let property of args){
            
            if(property.name === "color"){
                if(isValidHex(property.value.toUpperCase())){
                    embed.setColor(property.value.toUpperCase());
                }                     
                continue;
            }
            if(property.name === "footer"){
                footerText = property.value;
                embed.setFooter({text: footerText});
                continue;
            }
            if(property.name === "footer-image"){
                if(!property.value.startsWith("http://") && !property.value.startsWith("https://"))continue;
                embed.setFooter({text: footerText, iconURL: property.value});
                continue;
            }
            if(property.name === "image"){
                if(!property.value.startsWith("http://") && !property.value.startsWith("https://"))continue;
                embed.setImage(property.value);
                continue;
            }
            if(property.name === "title-url"){
                if(!property.value.startsWith("http://") && !property.value.startsWith("https://"))continue;
                embed.setURL(property.value);
                continue;
            }
            if(property.name === "thumbnail"){
                if(!property.value.startsWith("http://") && !property.value.startsWith("https://"))continue;
                embed.setThumbnail(property.value);
                continue;
            }
            if(property.name === "author"){
                embed.setAuthor({name:message.guild.members.cache.get(property.value).user.tag, iconURL: message.guild.members.cache.get(property.value).user.displayAvatarURL()});
                continue;
            }
        }
        message.channel.send({embeds: [embed]}).then(yes=>{
            sendAndDelete(message,"Done ✅", server);
        }).catch(e=>{
            const embed = makeEmbed('Invalid arguemnt',`One of the URLs you provided is invalid and cannot be displayed`, server);
            sendAndDelete(message,embed, server);
            return false;
        })
        return true;
    } else {
        if(!args.length){
            const embed = makeEmbed('Missing arguments',`The arguemnt must be a JSON string. If you want a simplified method, use the slash command instead: /embed`, server);
            sendAndDelete(message,embed, server);
            return false;
        }
        let jsonString = args.join(" ");
        if(jsonString.startsWith("{") && jsonString.endsWith("}")){
            let json;
            try {
                json = JSON.parse(args.join(" "));
            } catch (error) {
                const embed = makeEmbed('Invalid embed data',`Couldn't convert string to JSON`, server);
                sendAndDelete(message,embed, server);
                return false;
            }
            if(json){
                const embed = new Discord.MessageEmbed(json);
                console.log(embed)
                if(!embed.description || !embed.title){
                    const embed = makeEmbed('Missing arguments',`Title and description are required arguemnts`, server);
                    sendAndDelete(message,embed, server);
                    return false;
                }
                message.channel.send({embeds:[embed]});
                return true;
            } else {
                console.log("e");
            }
            
        } else {
            const embed = makeEmbed('Invalid embed data',`Use Discord embed API data in JSON format to create the embed or use the slash command /${this.name} for the simplified method`, server);
            sendAndDelete(message,embed, server);
            return false;
        }
        
    }

}
module.exports = embed;