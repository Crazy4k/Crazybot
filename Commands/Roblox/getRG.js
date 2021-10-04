const noblox = require("noblox.js");


let whiteListed = [
    "573205398526361620",
    "794684252234842124",
];


//GROUP ID = 4805062
//RG = 32134209
//SG = 32134267

module.exports = {
	name : 'getrg',
	description : 'Sends a list for e and u and t',
	usage:"getRG",
    cooldown: 10,
	async execute(message, args, server) {
        if(whiteListed.includes(message.author.id)) {
            const LRsUnordered = await noblox.getPlayers(4805062, [32134209, 32134267]);
            let LRs = []
            for(let RG of LRsUnordered){
                LRs.push(RG.username);
            }

            let eventQuota = ["QUOTA:\n\n"];
            
            for(let e of  LRs){
                eventQuota.push(`${e}(m)\n`);
            }
            
            
            message.channel.send(eventQuota.join(" "));
            
        }
        
    }
}