/**
 * Sends a message and then deletes it after a few seconds. If the initial message is a slash command, it will be an ephemeral reply
 * @param {object} message The message object
 * @param {*} msgToSend Either a string as message content or a message embed
 * @param {object} server The mongoDB-stored server data
 * @param {boolean} ignoreDefaultSetting wether to ignore the server's setting of deleting the message or not
 * @param {boolean} isDM Wether or not this message is in a DM
 */

module.exports = async(message, msgToSend, server, ignoreDefaultSetting = false, isDM = false) => {
 
    if(message.type === "APPLICATION_COMMAND"){
        if(typeof msgToSend === "object"){

            if(message.deferred){
                message.editReply({embeds:[msgToSend],ephemeral : true});
            } else message.reply({embeds:[msgToSend],ephemeral : true});

        } else if(typeof msgToSend === "string"){
            if( message.deferred){
                message.editReply({content: msgToSend ,ephemeral : true});
            } else message.reply({content: msgToSend ,ephemeral : true});
        }
        

    }else{

        if(typeof msgToSend === "object"){
            message.channel.send({embeds:[msgToSend]}).then(m=>{
                if(isDM)return;
                else
                if(server.deleteFailedCommands || ignoreDefaultSetting) {
                    setTimeout(()=>{
                        let M = m.channel.messages.cache.get(m.id);
                        let MESSAGE  = message.channel.messages.cache.get(message.id);
                        if(M)m.delete().catch(e=>e);
                        if(MESSAGE) message.delete().catch(e=>e);
                        
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
                        if(M)m.delete().catch(e=>e);
                        if(MESSAGE) message.delete().catch(e=>e);
                        
                    },server.deleteFailedMessagedAfter)
                   return;
                }
            })
        }

    }


}