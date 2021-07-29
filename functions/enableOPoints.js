const guildsCache = require("../caches/guildsCache");
const mongo = require("../mongo");
const serversSchema = require("../schemas/servers-schema");
let cache = require("../caches/officerPointsCache");
const pointsSchema = require("../schemas/officerPoints-schema");

module.exports = async (message, server) => { 

    let servery = cache[message.guild.id];

    if(!servery){
        await mongo().then(async (mongoose) =>{
            try{
                const data = await pointsSchema.findOne({_id:message.guild.id});
                servery = data;
            }
            finally{
                    
                console.log("FETCHED FROM DATABASE");
                mongoose.connection.close();
            }
        })
    }
    if(servery === null){
        await mongo().then(async (mongoose) =>{
            try{
                await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                    _id:message.guild.id,
                    whiteListedRole:"",
                    members:{}   
                },{upsert:true});
                servery = cache[message.guild.id] = {
                    _id:message.guild.id,
                    whiteListedRole:"",
                    members:{}  
                }
            } finally{
                
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
            }
        });	
    }
    if(!server.oPointsEnabled){

        let arrayOfIds = [];
        message.guild.members.cache.each(user => (arrayOfIds.push(user.id)));

        servery.members = {};
        arrayOfIds.forEach(i => servery.members[i] = 0);
        

        mongo().then(async (mongoose) =>{
            try{
                await pointsSchema.findOneAndUpdate({_id:message.guild.id},{
                    members:servery.members    
                },{upsert:true});
            } finally{
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
            }
        });
        cache[message.guild.id] = servery;

        await mongo().then(async (mongoose) =>{
            try{ 
                await serversSchema.findOneAndUpdate({_id:message.guild.id},{
                    oPointsEnabled:true,  
                },{upsert:false});
                guildsCache[message.guild.id].oPointsEnabled = true;
            } finally{
                console.log("WROTE TO DATABASE");
                mongoose.connection.close();
            }
        });
        
            
    } else return;         
}