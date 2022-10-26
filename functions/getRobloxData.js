const verificationSchema = require("../schemas/verification-schema");
const {robloxVerificationCache} = require("../caches/botCache")
const mongo = require("../mongo");


/**
 * 
 * @param {String} userId the Discord ID of the user
 * @param {Boolean} forceFetch whether get the data from the database instead of the local cache 
 * @returns {Object || String} Object if success or Srting if reject
 */
module.exports = async(userId, forceFetch)=>{

    return new Promise(async(resolve, reject) => {
        
        if(robloxVerificationCache[userId] && !forceFetch){
            

            let data = robloxVerificationCache[userId];
            data.status = "ok";

            return resolve(data);
        }  

        await mongo().then(async (mongoose) =>{
            try{ 
                
     
                let data = await verificationSchema.findOne({_id: userId});


                if(data !== null){

                    robloxVerificationCache[userId] = data
                    data.status = "ok";

                    

                    return resolve(data);

                } else {
                    
                    return reject("not_found");
                    
                }
                
                
            } catch(error){
                console.log(error);
                
                reject("mongo_error")
                
            }finally{
                console.log("FETCHED FROM DATABASE");
                mongoose.connection.close();
            }
        });
        
    });

    
}
