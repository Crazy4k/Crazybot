module.exports = (message, msgToSend, server, ignoreDefaultSetting = false, isDM = false) => {
 
    if(typeof msgToSend === "object"){
        message.channel.send({embeds:[msgToSend]}).then(m=>{
            if(isDM)return;
            else
            if(server.deleteFailedCommands || ignoreDefaultSetting) {
                setTimeout(()=>{
                    let M = m.channel.messages.cache.get(m.id);
                    let MESSAGE  = message.channel.messages.cache.get(message.id);
                    if(M)m.delete().catch(e=>console.log(e));
                    if(MESSAGE) message.delete().catch(e=>console.log(e));
                    
                },server.deleteFailedMessagedAfter)
               return;
            }
        })
    }
    
    else if(typeof msgToSend === "string") {
        message.channel.send({content:msgToSend}).then(m=>{
            if(isDM)return;
            else 
            if(server.deleteFailedCommands || ignoreDefaultSetting) {
                setTimeout(()=>{
                    let M = m.channel.messages.cache.get(m.id);
                    let MESSAGE  = message.channel.messages.cache.get(message.id);
                    if(M)m.delete().catch(e=>console.log(e));
                    if(MESSAGE) message.delete().catch(e=>console.log(e));
                    
                },server.deleteFailedMessagedAfter)
               return;
            }
        })
    }


}