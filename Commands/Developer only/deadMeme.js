const {bot_info} = require("../../config/config.json");
const authorID = bot_info.authorID;
const Command = require("../../Classes/Command");
const cache = require("../../caches/botCache");
const susSchema = require("../../schemas/sus-schema");
const mongo = require("../../mongo");
const sendAndDelete = require("../../functions/sendAndDelete");






let deadMeme = new Command("deadmeme");

deadMeme.set({
	aliases         : ["addsus"],
	description     : "[DEV_ONLY] adds 1 amogus to the collection of amogi",
	usage           : "deadmeme <link>",
	cooldown        : 5,
	unique          : false,
	category        : null,
	worksInDMs      : false,
	isDevOnly       : true,
});

    
deadMeme.execute = async function(message, args, server, isSlash){ 

    
    if (message.author.id !== authorID) return false

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
	
    if(!args[0]){
        sendAndDelete(message, "Bro forgor to add an amogus reference 💀", server);
        return false;
    }
    cache.mogusCache.push(args.join(" "));
    
    mongo().then(async (mongoose) =>{
        try{
            await susSchema.findOneAndUpdate({_id:"sus"},{
                  links: cache.mogusCache
            },{upsert:true});
            
            message.reply(`✅ "${args.join(" ")}" has been added to the sussy collection`);
            
        } finally{
    
            console.log("WROTE TO DATABASE");
            mongoose.connection.close();
        }
    })

       
    
}


module.exports = deadMeme; 