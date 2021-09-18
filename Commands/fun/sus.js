const pickRandom = require("../../functions/pickRandom");

module.exports = {
	name : 'sus',
	aliases: ["easter-egg"],
	description : 'very sus',
	cooldown: 3,
	worksInDMs: true,
	category:"fun",
	usage:'sus',
	execute(message, args, server) {
		
		const crewMates = ["AMOGUS.mp4","Black.png","Blue.png","Lime.png","Pink.png","Red.png","sos.mp4","White.png"];
		const imposters = ["https://www.youtube.com/watch?v=iy-yWsECrUQ","https://www.youtube.com/watch?v=grd-K33tOSM", "https://www.youtube.com/watch?v=-tzve55-ZqU", "https://www.youtube.com/watch?v=i2ZgbPPCV-A", "https://www.youtube.com/watch?v=WzzCpfDQUxM", "https://www.youtube.com/watch?v=_ydI2Wjr_g0", "https://www.youtube.com/watch?v=0bZ0hkiIKt0","https://www.youtube.com/watch?v=Wec5KoSnAs8","https://www.youtube.com/watch?v=obmlZH3X9gs","https://www.youtube.com/watch?v=wHEmkWXCQt0","https://youtu.be/WHbPBdHIPPM?t=123", ]
		
		let winner = pickRandom(3);

		if(winner === 2){
			message.channel.send({content: `amogus`, files :[`./sus pictures/${pickRandom(crewMates)}`]});
			return true;
		}else {
			message.channel.send(`amogus\n${pickRandom(imposters)}`);
			return true;
		}
        
	},

};
