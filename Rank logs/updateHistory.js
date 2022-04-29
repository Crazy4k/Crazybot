const tsuGroups = require("../config/TSUGroups.json")
const noblox = require("noblox.js");
const cache = require("./cache");
const makeEmbed = require("../functions/embed");
const colors = require("../config/colors.json");
const axios = require("axios");
const moment = require("moment");
const settings = require("./config.json");
const fs = require("fs");
const {MessageActionRow, MessageButton} = require("discord.js");

const pictures = {
  up: "https://cdn.discordapp.com/attachments/926507472611582002/968125838656671795/IMG_1545.png",
  down: "https://cdn.discordapp.com/attachments/926507472611582002/968125838308540497/IMG_1544.png",
  plus: "https://cdn.discordapp.com/attachments/926507472611582002/968123881669935104/IMG_1547.png",
  minus: "https://cdn.discordapp.com/attachments/926507472611582002/968123881988710460/IMG_1548.png",

}
const usernamesCache = {};

module.exports = async (client) =>{

  
  const hierarchy = cache.roles;
  const ranks = cache.ranks;
  const changes = {}
  const date = moment().format("YYYY-MM-DD");
  
  for(let groupId in ranks){
    

    for(let role of ranks[groupId]){

      const players = [];

      const apiFetch = await axios.get(`https://groups.roblox.com/v1/groups/${groupId}/roles/${role}/users?limit=100&sortOrder=Asc`);
      let nextPage = apiFetch.data.nextPageCursor;
      players.push(...apiFetch.data.data);

      while(nextPage){
        
        const apiFetch2 = await axios.get(`https://groups.roblox.com/v1/groups/${groupId}/roles/${role}/users?limit=100&sortOrder=Asc&cursor=${nextPage}`);
        nextPage = apiFetch2.data.nextPageCursor;
        players.push(...apiFetch2.data.data);
      }
      
      
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

  if(promotions.length)console.log("promotions", promotions);
  if(demotions.length)console.log("demotions", demotions);

  
  let thing =  fs.readFileSync("./Private_JSON_files/TSU_careers.json","utf-8");
  const careers = JSON.parse(thing);


  for(let promotion of promotions){

    const {username, userId, group} = promotion;
    const channel = client.channels.cache.get(settings[group].channel);

    
    if(!careers[userId]){
      careers[userId] = {
        username: usernamesCache[userId] ?? await noblox.getUsernameFromId(userId),
        userId,
        ranks: [
          hierarchy[promotion.newRank].name
        ],
        roles: [
          hierarchy[promotion.newRank].hierarchy
        ],
        groups: [
          tsuGroups[group].name
        ],
        dates: [
          date
        ]
      };
    } else {
      const member = careers[userId];
      if(member?.groups?.includes(tsuGroups[group].name)){
        //user is already in the group, compare rank and push if higher
        const index = member.groups.indexOf(tsuGroups[group].name);
        if(member.roles[index] < hierarchy[promotion.newRank].hierarchy){
          careers[userId].roles.splice(index, 1, hierarchy[promotion.newRank].hierarchy );
          careers[userId].ranks.splice(index, 1, hierarchy[promotion.newRank].name);
          
        }
      } else {
        //user is new the to the group, push rank
        careers[userId].groups.push(tsuGroups[group].name);
        careers[userId].dates.push(date);
        careers[userId].roles.push(hierarchy[promotion.newRank].hierarchy)
        careers[userId].ranks.push(hierarchy[promotion.newRank].name);
      }
    }


    if(channel){
        
      let ping =`<@&${settings[group].role}>`
      let embed = makeEmbed(`There has been a promotion`,`${username} was promoted to \`${hierarchy[promotion.newRank].name}\``, "00AAFF", true, "CrazyBot TSU rank logs");
      embed.setAuthor({name: "Promotion",iconURL: pictures.up});

      if(hierarchy[promotion.oldRank].hierarchy > hierarchy[promotion.newRank].hierarchy){

        embed = makeEmbed(`There has been a demotion`,`${username} was demoted to \`${hierarchy[promotion.newRank].name}\``, "660199", true, "CrazyBot TSU rank logs");
        embed.setAuthor({name: "Demotion",iconURL: pictures.down});

      } else if(tsuGroups[group].isDivision && promotion.oldRank === null){

        embed = makeEmbed(`A member has joined/ been accepted!`,`${username} was accepted: \`${hierarchy[promotion.newRank].name}\``, "09CA00", true, "CrazyBot TSU rank logs");
        embed.setAuthor({name: "Join",iconURL: pictures.plus});
      }

      embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`);
      embed.addField("Username", username, true);
      embed.addField("Group", tsuGroups[group].name, true);
      embed.addField("\u200b","\u200b");
      if(!tsuGroups[group].isDivision || promotion.oldRank !== null)embed.addField("Old rank", hierarchy[promotion.oldRank].name, true);
      embed.addField("New rank", hierarchy[promotion.newRank].name, true);

      const profileButton = new MessageButton()
      .setLabel(`${username}'s profile`)
      .setStyle('LINK')
      .setEmoji("👤")
      .setURL(`https://www.roblox.com/users/${userId}/profile`);

      const groupButton = new MessageButton()
      .setLabel(`${tsuGroups[group].name} group link`)
      .setStyle('LINK')
      .setEmoji(settings[group].emoji || "🏘")
      .setURL(`https://www.roblox.com/groups/${group}`);
      let row = new MessageActionRow().addComponents(profileButton, groupButton);

      channel.send({embeds:[embed], components:[row], content: ping}).catch(e=>console.log(e));
      
    }

 
  }

  let stringObj = JSON.stringify(careers, null, 2);
  fs.writeFile("./Private_JSON_files/TSU_careers.json",stringObj ,(err, config)=>{
    if(err) {
      console.log(err);
    }
  });

  for(let demotion of demotions){

    const {username, userId, group} = demotion;
    const channel = client.channels.cache.get(settings[group].channel);
    

    if(channel && demotion.newRank === null){
        
      let ping = `<@&${settings[group].role}>`


      let embed = makeEmbed(`A member has left/ been kicked!`,`${username} discharged / was exiled`, "C10000", true, "CrazyBot TSU rank logs");
      if(tsuGroups[group].isBranch)embed = makeEmbed(`There has been a demotion`,`${username} has been demoted`, "660199", true, "CrazyBot TSU rank logs");
      embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`);
      if(tsuGroups[group].isBranch)embed.setAuthor({name: "Demotion",iconURL: pictures.down});
      else embed.setAuthor({name: "Kick",iconURL: pictures.minus})
      
      embed.addField("Username", username, true);
      embed.addField("Group", tsuGroups[group].name, true);
      embed.addField("\u200b","\u200b");
      embed.addField("Old rank", hierarchy[demotion.oldRank].name, true);
      if(tsuGroups[group].isBranch)embed.addField("New rank", hierarchy[null].name, true);
      const profileButton = new MessageButton()
      .setLabel(`${username}'s profile`)
      .setStyle('LINK')
      .setEmoji("👤")
      .setURL(`https://www.roblox.com/users/${userId}/profile`);

      const groupButton = new MessageButton()
      .setLabel(`${tsuGroups[group].name} group link`)
      .setStyle('LINK')
      .setEmoji(settings[group].emoji || "🏘")
      .setURL(`https://www.roblox.com/groups/${group}`);
      let row = new MessageActionRow().addComponents(profileButton, groupButton);

      channel.send({embeds:[embed], components:[row], content: ping}).catch(e=>console.log(e));
      
    }

  }

    
  
}
