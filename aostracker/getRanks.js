const noblox = require("noblox.js");



module.exports = async(group) =>{
  
  let rolesArray = await noblox.getRoles(group);
  let rolesIds = [];

  for(let I of rolesArray)rolesIds.push(I.id);

  const playersArray = await noblox.getPlayers(group, rolesIds);
  let players = [];


  for (let e of playersArray){
    players.push(e.userId);
  };

  return players;
  
}