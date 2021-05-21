module.exports = (message, msgToSend, server) => {

    message.channel.send(msgToSend)
        .then(m => {
            if(server.deleteFailedCommands) {
                m.delete({ timeout : server.deleteFailedMessagedAfter })
                    .catch(console.error);
                message.delete({timeout: server.deleteFailedMessagedAfter})
                    .catch(console.error);
                return;
            }
        })

}