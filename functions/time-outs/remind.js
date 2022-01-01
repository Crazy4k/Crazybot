
module.exports = (client, data) =>{
    const channel = client.channels.cache.get(data.channelId);
    if(channel){
        channel.send(`<@${data.authorId}> **Reminder**: ${data.text}`).catch(err=>console.log(err));
    }
}