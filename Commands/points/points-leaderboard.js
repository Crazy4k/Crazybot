const makeEmbed = require("../../functions/embed");
const sendAndDelete = require("../../functions/sendAndDelete");
let cache = require("./cache");
const mongo = require("../../mongo");
const pointsSchema = require("../../schemas/points-schema");


module.exports = {
	name : 'points-leaderboard',
	description : "shows the top 20 people with the most points.",
    aliases:["plb","p-top","points-lb", "points-top"],
    cooldown: 5,
	usage:'!points-leaderboard',
	async execute(message, args, server) { 

        if(!server.pointsEnabled){
            const embed =makeEmbed(`Your server points plugin isn't active yet.`,`Do "${server.prefix}points-enable" Instead.`, server)
            sendAndDelete(message, embed, server);
            return false;
        }

          
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
        let membersObj = cache[message.guild.id].members;

        let arrayOfObjects = [];

        for (let I in membersObj){

            let smallObject = {};
            smallObject.name = I;
            smallObject.points = membersObj[I];
            
            arrayOfObjects.push(smallObject);
        }
        
        arrayOfObjects.sort((a,b)=>b.points - a.points);
        
        let arrayOfStrings = [];
        
        for (let i = 0; i < 20; i++) {

            if(!arrayOfObjects[i])break;

            let str = `${i+1}: <@${arrayOfObjects[i].name}> with ${arrayOfObjects[i].points} points\n\n`;
            arrayOfStrings.push(str);
             
        }


        const emb = makeEmbed("points leaderboard", `${arrayOfStrings.join(" ")}`, server,false)
        message.channel.send(emb);                                    
        return true;
	},

};
