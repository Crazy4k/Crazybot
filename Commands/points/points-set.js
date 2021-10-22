const checkUseres = require("../../functions/checkUser");
const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
let cache = require("../../caches/botCache").pointsCache;
const mongo = require("../../mongo");
const pointsSchema = require("../../schemas/points-schema");
const enable = require("../../functions/enablePoints");
const {Permissions} = require("discord.js");
const promote = require("../../functions/promote");
const Command = require("../../Classes/Command");

let pointsSet = new Command("points-set");

pointsSet.set({
    
	aliases         : ["p-set","pset","p-change","p-edit","pchange","pedit"],
	description     : "Sets a person's points to whatever the second arugment is.",
	usage           : "points-set <@user> <points> [reason]",
	cooldown        : 7,
	unique          : false,
	category        : "points",
	whiteList       : null,
	worksInDMs      : false,
	isDevOnly       : false,
	isSlashCommand  : false
})


pointsSet.execute = async function(message, args, server){ 

    if(!server.pointsEnabled) await enable(message, server);

    let servery = cache[message.guild.id];

    if(!servery){
        await mongo().then(async (mongoose) =>{
            try{
                const data = await pointsSchema.findOne({_id:message.guild.id});
                cache[message.guild.id] = servery = data;
            }
            finally{
                    
                console.log("FETCHED FROM DATABASE");
                mongoose.connection.close();
            }
        })
    }

    if(message.guild.members.cache.get(message.author.id).permissions.has(Permissions.FLAGS["ADMINISTRATOR"]) || message.guild.members.cache.get(message.author.id).roles.cache.has(servery.whiteListedRole)){
        let target = checkUseres(message, args, 0);
        
        switch (target) {
            case "not valid":
            case "everyone":	
            case "not useable":
                
                const embed1 = makeEmbed('invalid username',this.usage, server);
                sendAndDelete(message,embed1, server);
                return false;
                break;
            case "no args": 
                const embed69 = makeEmbed('Missing arguments',this.usage, server);
                sendAndDelete(message,embed69, server);
                return false;
                break;
            default:

                
                let reason = args.splice(2).join(" ");   
                if(!reason) reason = "`No reason given.`"
                let log = message.guild.channels.cache.get(server.logs.pointsLog);    
                let pointstoChange = args[1];
                if(!pointstoChange){
                    const embed69 = makeEmbed('Missing arguments',this.usage, server);
                    sendAndDelete(message,embed69, server);
                    return false;
                }
                if(isNaN(pointstoChange)){
                    const embed1 = makeEmbed('Value must a number',this.usage, server);
                    sendAndDelete(message,embed1, server);
                    return false;
                }
                let before = servery.members[target]; 
                servery.members[target] = pointstoChange;
                if( servery.members[target] < 0 || !servery.members[target])  servery.members[persona] = 0;

                if(servery.members[target]=== undefined)servery.members[target] = 0;
                await mongo().then(async (mongoose) =>{
                    try{
                        await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                            
                            members:servery.members    
                        },{upsert:true});
                        cache[message.guild.id] = servery;
                    }
                    finally{
                            
                        console.log("WROTE TO DATABASE");
                        mongoose.connection.close();
                    }
                })
                await promote(message,target,server);
                const emb = makeEmbed("User's points have been set!", `<@${target}>'s points have been changed from \`${before}\` to \`${servery.members[target]}\` points.`, server,false)
                message.channel.send({embeds:[emb]}).catch(e=> console.log(e));     
                if(log){
                    let embed = makeEmbed("Points changed.","","3987FF",true);
                    embed.setAuthor(message.author.tag, message.author.displayAvatarURL());
                    embed.addFields(
                    {name: "Chagned by:", value: `<@${message.author.id}>`, inline:true},  
                    {name: "Changed from:", value: `<@${target}>`, inline:true},
                    {name: "Amount before:", value: `${before} `, inline:true},
                    {name: "Amount after:", value: `${servery.members[target]}`, inline:true},
                    {name: "Reason:", value: reason, inline:true},      
                    );
                    log.send({embeds:[embed]}).catch(e=> console.log(e));
                    return true;
                }
            } 
    } else {
            const embed = makeEmbed("Missing permission","You don't have the required permission to run this command","FF0000",);
            sendAndDelete(message,embed,server);
            return false;
        }                                
            return true;

        
    
    
}
    module.exports = pointsSet;