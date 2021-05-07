module.exports = function sendAndDelete(message, msgToSend, server, faliedCommandTO, failedEmbedTO) {

    message.channel.send(msgToSend)
        .then(m => {
            if(server.deleteFailedCommands) {
                m.delete({ timeout : failedEmbedTO })
                    .catch(console.error);
                message.delete({timeout: faliedCommandTO})
                    .catch(console.error);
                return;
            }
        })

}