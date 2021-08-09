module.exports = (message, msgToSend, server, ignoreDefaultSetting = false) => {
 
    if(typeof msgToSend === "object"){
        message.channel.send({embeds:[msgToSend]}).then(m=>{
            if(server.deleteFailedCommands || ignoreDefaultSetting) {
                setTimeout(()=>{
        
                    m.delete().catch(console.error);
                    message.delete().catch(console.error);
                    
                },server.deleteFailedMessagedAfter)
               return;
            }
        })
    }
    
    else if(typeof msgToSend === "string") {
        message.channel.send({content:msgToSend}).then(m=>{
            if(server.deleteFailedCommands || ignoreDefaultSetting) {
                setTimeout(()=>{
        
                    m.delete().catch(console.error);
                    message.delete().catch(console.error);
                    
                },server.deleteFailedMessagedAfter)
               return;
            }
        })
    }


}