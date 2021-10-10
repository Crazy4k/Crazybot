const Command = require("../../Classes/Command");

let ping = new Command("ping");
ping.set({
    aliases: [],
    description         : "Replies with pomg",
    cooldown            : 0,
    category            : "others",
    whiteList           : false,
    unique              : false,
    worksInDMs          : true,
    isDevOnly           : false,
    isSlashCommand      : true,
    isTestOnly          : false,
    usage               : "ping"
})
ping.execute = function(message, args, server){
    message.reply("pong");
    return true;
}

module.exports = ping;