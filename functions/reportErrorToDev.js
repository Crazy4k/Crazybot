const {authorID} = require("../config/config.json").bot_info;
const makeEmbed = require("../functions/embed");

module.exports = (error, message, client, command) => {
    try {
        const authorUser = client.users.cache.get(authorID);
        if(authorID){
            let channel;
            let authoID;
            let prefix = ";";
            if(!message.guild) channel = "`DM OR ELSE`";
            else channel = `${message.guild?.name}(${message.guild.id})`;
            if(message.type === "APPLICATION_COMMAND"){
                authoID = message.user.id;
                prefix = "/"
            }
            else authoID = message.author.id
            const embed = makeEmbed("Error report!",`The user <@${authoID}> (${authoID}) has caused an error in the server (${channel}) using the command \`${prefix}${command.name}\` with the message \n\`\`\`${message.content}\`\`\`\n\n\nError details: \n\n${error}`, "RED");
            authorUser.send({embeds:[embed]}).catch(e=>console.log(e));


        }
    } catch (error) {
        console.log(error);
    }
}