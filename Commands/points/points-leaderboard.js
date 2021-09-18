const makeEmbed = require("../../functions/embed");
let cache = require("../../caches/botCache").pointsCache;
const mongo = require("../../mongo");
const pointsSchema = require("../../schemas/points-schema");
const enable = require("../../functions/enablePoints");


module.exports = {
	name : 'points-leaderboard',
	description : "shows the top 20 people with the most points.",
    aliases:["plb","p-top","points-lb", "points-top"],
    cooldown: 5,
	usage:'points-leaderboard',
    category:"points",
	async execute(message, args, server) { 

        if(!server.pointsEnabled)await enable(message, server);
            
        

          
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
        // i really have no fucking clue how I made this but it works 🤷‍♂️
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
        message.channel.send({ embeds: [emb]});                                    
        return true;
	},

};
