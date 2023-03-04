const pickRandom = require("../../functions/pickRandom");
const Command = require("../../Classes/Command");
const cache = require("../../caches/botCache");
const susSchema = require("../../schemas/sus-schema");
const mongo = require("../../mongo");

let sus = new Command("sus");

sus.set({
    
	aliases         : ["amogus", "📮"],
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



sus.execute = async (message, args, server) => {

	
	
	if(cache.mogusCache.length === 0){
		await mongo().then(async (mongoose) =>{
			try{ 
				let data = await susSchema.findOne({_id:"sus"});
				cache.mogusCache = data.links;
			} catch(error){
				console.log(error);
				
			}finally{
				console.log("FETCHED FROM DATABASE");
				mongoose.connection.close();
			}
		});
	}
	
	
	message.reply(`${pickRandom(cache.mogusCache)}`);
	return true;
	
	
}
	
module.exports = sus;
