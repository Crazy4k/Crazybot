const tsuGroups = require("../config/TSUGroups.json")
const noblox = require("noblox.js");
const cache = require("./cache");
const makeEmbed = require("../functions/embed");
const colors = require("../config/colors.json");
const settings = require("./config.json");
const {MessageActionRow, MessageButton} = require("discord.js");

module.exports = async (client) =>{

  
  const hierarchy = cache.roles;
  const ranks = cache.ranks;
  const usernamesCache = {};
  const changes = {}
  
  
  for(let groupId in ranks){
    

    for(let role of ranks[groupId]){

      const players = await noblox.getPlayers(groupId, role).catch(e=>console.log(e));
      
      for(let player of players){
        
        usernamesCache[player.userId] = player.username;

        if(!changes[groupId])changes[groupId] = {};
        if(!changes[groupId][role])changes[groupId][role] = [];

        changes[groupId][role].push(player.userId);
      
      }


    }
    /*{
      group:{
        role1:[people]
        role2:[people]
        role3:[people]
      }
    }*/ 
  }
  let promotions = [];
  let demotions = [];
  const oldChanges = cache.compare;

  if(!Object.values(cache.compare).length)cache.compare = changes;
  else {
    for(let groupID in changes){

      let group = changes[groupID];

      for(let roleID in group){

        let role = group[roleID];

        for(let user of role){

          if(!oldChanges?.[groupID]?.[roleID]?.includes(user)){

            let oldRank = null;

            for(let roleID in oldChanges[groupID]){

              let role = oldChanges[groupID][roleID];
              

              for(let user2 of role){
                if(user2 === user) oldRank = roleID;
              }

            }
            
            promotions.push({
              username: usernamesCache[user] ?? await noblox.getUsernameFromId(user),
              userId: user,
              group: groupID,
              oldRank: hierarchy[oldRank].name ? oldRank : null,
              newRank: roleID
            })

          }

        }

      }

    }


    for(let groupID in oldChanges){

      let group = oldChanges[groupID];

      for(let roleID in group){

        let role = group[roleID];

        for(let user of role){

          if(!changes?.[groupID]?.[roleID]?.includes(user)){

            let newRank = null;

            for(let roleID in changes[groupID]){

              let role = changes[groupID][roleID];
              

              for(let user2 of role){
                if(user2 === user) newRank = roleID;
              }

            }
            
            demotions.push({
              username: usernamesCache[user] ?? await noblox.getUsernameFromId(user),
              userId: user,
              group: groupID,
              oldRank: roleID,
              newRank: hierarchy[newRank].name ? newRank : null
            })

          }

        }

      }

    }




  }
  cache.compare = changes;

  for(let promotion of promotions){

    const {username, userId, group} = promotion;
    const channel = client.channels.cache.get(settings[group].channel);

    if(channel){
        
      let ping =`<@&${settings[group].role}>`
      let embed = makeEmbed(`There has been a promotion`,`${username} was promoted to \`${hierarchy[promotion.newRank].name}\``, colors.changeBlue, true, "CrazyBot TSU rank logs");

      if(hierarchy[promotion.oldRank].hierarchy > hierarchy[promotion.newRank].hierarchy){
        embed = makeEmbed(`There has been a demotion`,`${username} was demoted to \`${hierarchy[promotion.newRank].name}\``, "9700E2", true, "CrazyBot TSU rank logs");
      } 

      embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`);
      embed.setAuthor({name: "CrazyBot",iconURL: client.user.displayAvatarURL()})
      embed.addField("Username", username, true);
      embed.addField("Group", tsuGroups[group].name, true);
      embed.addField("\u200b","\u200b");
      embed.addField("Old rank", hierarchy[promotion.oldRank].name, true);
      embed.addField("New rank", hierarchy[promotion.newRank].name, true);

      const profileButton = new MessageButton()
      .setLabel(username)
      .setStyle('LINK')
      .setEmoji("👤")
      .setURL(`https://www.roblox.com/users/${userId}/profile`);

      const groupButton = new MessageButton()
      .setLabel(tsuGroups[group].name)
      .setStyle('LINK')
      .setURL(`https://www.roblox.com/groups/${group}`);
      let row = new MessageActionRow().addComponents(profileButton, groupButton);

      channel.send({embeds:[embed], components:[row], content: ping}).catch(e=>console.log(e));
      
    }


  }
  for(let demotion of demotions){

    const {username, userId, group} = demotion;
    const channel = client.channels.cache.get(settings[group].channel);
    

    if(channel && demotion.newRank === null){
        
      let ping = `<@&${settings[group].role}>`


      let embed = makeEmbed(`There has been a demotion`,`${username} was kicked`, colors.failRed, true, "CrazyBot TSU rank logs");
      if(tsuGroups[group].isBranch)embed = makeEmbed(`There has been a demotion`,`${username} has been demoted`, "9700E2", true, "CrazyBot TSU rank logs");
      embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`);
      embed.setAuthor({name: "CrazyBot",iconURL: client.user.displayAvatarURL()})
      embed.addField("Username", username, true);
      embed.addField("Group", tsuGroups[group].name, true);
      embed.addField("\u200b","\u200b");
      embed.addField("Old rank", hierarchy[demotion.oldRank].name, true);
      if(tsuGroups[group].isBranch)embed.addField("New rank", hierarchy[null].name, true);
      const profileButton = new MessageButton()
      .setLabel(username)
      .setStyle('LINK')
      .setEmoji("👤")
      .setURL(`https://www.roblox.com/users/${userId}/profile`);

      const groupButton = new MessageButton()
      .setLabel(tsuGroups[group].name)
      .setStyle('LINK')
      .setURL(`https://www.roblox.com/groups/${group}`);
      let row = new MessageActionRow().addComponents(profileButton, groupButton);

      channel.send({embeds:[embed], components:[row], content: ping}).catch(e=>console.log(e));
      
    }

  }

    
  
}
