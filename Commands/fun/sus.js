const pickRandom = require("../../functions/pickRandom");
const Command = require("../../Classes/Command");

let sus = new Command("sus");

sus.set({
    
	aliases         : ["amogus"],
	description     : "NOT A DEAD MEME STOP 😳😳😳😱",
	usage           : "sus",
	cooldown        : 3,
	unique          : false,
	category        : "fun",
	worksInDMs      : true,
	isDevOnly       : false,
	isSlashCommand  : true,
	requiredPerms	: "EMBED_LINKS"
})



sus.execute = (message, args, server) => {
	
	
	const imposters = [
		"https://www.youtube.com/watch?v=KByREO4gB0M",
		"https://www.youtube.com/watch?v=iy-yWsECrUQ",
		"https://www.youtube.com/watch?v=grd-K33tOSM", 
		"https://www.youtube.com/watch?v=-tzve55-ZqU", 
		"https://www.youtube.com/watch?v=i2ZgbPPCV-A", 
		"https://www.youtube.com/watch?v=WzzCpfDQUxM", 
		"https://www.youtube.com/watch?v=0bZ0hkiIKt0",
		"https://www.youtube.com/watch?v=Wec5KoSnAs8",
		"https://www.youtube.com/watch?v=obmlZH3X9gs",
		"https://www.youtube.com/watch?v=wHEmkWXCQt0",
		"https://youtu.be/WHbPBdHIPPM?t=123",
		"https://www.youtube.com/watch?v=KWtwIf-TSlo",
		"https://www.youtube.com/watch?v=jU0M9RP3sAc",
		"https://www.youtube.com/watch?v=jU0M9RP3sAc",
		"https://www.youtube.com/watch?v=cvY7QXOs0fY",
		"https://www.youtube.com/watch?v=CaBlnJq4b5I",
		"https://www.youtube.com/watch?v=7LcPbuD12lQ" 
	]
	
	
	message.reply(`amogus\n${pickRandom(imposters)}`);
	return true;
	
	
}
	
module.exports = sus;
