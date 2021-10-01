const noblox = require("noblox.js");



module.exports = async(group) =>{
 
  let rolesArray 
  let rolesIds = [];
  if(typeof group === "number") {
    rolesArray = await noblox.getRoles(group);

    for(let I of rolesArray)rolesIds.push(I.id);

    const playersArray = await noblox.getPlayers(group, rolesIds);

    let players = [];

    for (let e of playersArray){
      players.push(e.userId);
    };
    return players;
  }
  else if(Array.isArray(group)) {

    rolesArray = await Promise.all(group.map(id => noblox.getRoles(id)));
    
    for (let I = 0; I < group.length; I++) {
      const poop =[];
      const i = rolesArray[I];
      for(let j of i){

        poop.push(j.id);
        rolesIds[I] = poop;
        
      }
       
    }

    let playersArray; 
    playersArray = await Promise.all(group.map(id => noblox.getPlayers(id, rolesIds[group.indexOf(id)])));

    let players = [];



    for (let group of playersArray){
      for(let member of group){

        players.push(member.userId);
        
      }
    };

    return players;
  }
  
}