const {authorID} = require("../config/config.json").bot_info;
const makeEmbed = require("../functions/embed");

module.exports = (error, message, client, command) => {
    try {
        const authorUser = client.users.cache.get(authorID);
        if(authorID){
            let channel;
            if(!message.guild) channel = "`DM OR ELSE`";
            else channel = `${message.guild.name}(${message.guild.id})`;
            const embed = makeEmbed("Error report!",`The user <@${message.author.id}> (${message.author.id}) has caused an error in the server (${channel}) using the command \`;${command.name}\` with the message \n\`\`\`${message.content}\`\`\`\n\n\nError details: \n\n${error}`);
            authorUser.send({embeds:[embed]}).catch(e=>console.log(e));


        }
    } catch (error) {
        console.log(error);
    }
}