const noblox = require("noblox.js");



module.exports = async(group) =>{
 
  let rolesArray 
  let rolesIds = [];
  if(typeof group === "number") {
    rolesArray = await noblox.getRoles(group).catch(e=>console.log(e));

    for(let I of rolesArray)rolesIds.push(I.id);

    const playersArray = await noblox.getPlayers(group, rolesIds).catch(error=>console.log(error));

    let players = [];

    for (let e of playersArray){
      players.push(e.userId);
    };
    return players;
  }
  else if(Array.isArray(group)) {

    let erroredOut = false;

    rolesArray = await Promise.all(group.map(id => noblox.getRoles(id))).catch(e=>erroredOut = true);

    if(erroredOut)return [];
    
    for (let I = 0; I < group.length; I++) {
      const poop =[];
      const group = rolesArray[I];
      for(let role of group){
        poop.push(role.id);
        rolesIds[I] = poop;
        
      }
       
    }

    let playersArray; 
    playersArray = await Promise.all(group.map(id => noblox.getPlayers(id, rolesIds[group.indexOf(id)]))).catch(e=>erroredOut = true);

    if(erroredOut)return [];

    let players = [];



    for (let group of playersArray){
      for(let member of group){

        players.push(member.userId);
        
      }
    };

    return players;
  }
  
}