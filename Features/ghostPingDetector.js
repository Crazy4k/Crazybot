

module.exports = (message)=>{
    if(message.author.bot || !message.author|| message.mentions.size === 0) return;
    if(message.mentions.users.size > 0||message.mentions.roles.size > 0 || message.mentions.everyone){
        message.channel.send(`imagine ghost pinging <@${message.author.id}>`);
        return;
    }
}