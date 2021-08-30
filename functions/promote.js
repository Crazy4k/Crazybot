let cache  = require("..//caches/pointsCache");
const pointsSchema = require("../schemas/points-schema");
const mongo = require("../mongo");
const enable = require("./enablePoints");


module.exports = async (message, guildMember, server) => {
    if(!server.pointsEnabled) await enable( message, server);


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
    if(servery.rewards && Object.values(cache).length !== 0){
        let hisPoints = servery.members[guildMember];
        let ar = [];
        for(let I in servery.rewards){
            if(servery.rewards[I][0] <= hisPoints && servery.rewards[I][1] !== "" && servery.rewards[I][1] && servery.rewards[I][0] > 0){
                ar.push(servery.rewards[I]);
            }
        }
        ar.sort((a,b)=>b[0] - a[0]);
       
        if(ar.length){
            let guy = message.guild.members.cache.get(guildMember);
            if(guy){
                if(guy.manageable){
                    let arr = [];
                    for(let i in servery.rewards){
                        let role = servery.rewards[i][1]
                        if(role !== "" && role)arr.push(role);
                    }
                    guy.roles.remove(arr).catch(e=>console.log(e));
                   setTimeout(()=>{guy.roles.add(ar[0][1]).catch(e=>console.log(e));},1000) 
                } 
            }
        }else{
            let guy = message.guild.members.cache.get(guildMember);
            if(guy){
                if(guy.manageable){
                    let arr = [];
                    for(let i in servery.rewards){
                        let role = servery.rewards[i][1]
                        if(role !== "" && role)arr.push(role);
                    }
                    
                    guy.roles.remove(arr).catch(e=>console.log(e));
                
                } 
            }
        }
    }


}