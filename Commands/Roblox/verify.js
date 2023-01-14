const Command = require("../../Classes/Command");
const getRobloxData = require("../../functions/getRobloxData");
const makeEmbed = require("../../functions/embed");
const verificationSchema = require("../../schemas/verification-schema")
const {robloxVerificationCache} = require("../../caches/botCache")
const {MessageActionRow, MessageButton} = require("discord.js");
const updateRobloxUser = require("../../functions/updateRobloxUser")
const mongo = require("../../mongo")
const axios = require("axios");

const idleMessage = "Command cancelled due to the user being idle";
const cancerCultureMessage = "Command cancelled";

const randomWords = [
    {//animals_0
        0: "cat",1: "dog",2: "elephant",3: "dolphin",4: "wolf",5: "cow",6: "chicken",7: "horse",8: "monkey",9: "camel"
    },{//verbs_1
        0: "eat",1: "sleep",2: "dream",3: "think",4: "hide",5: "talk",6: "walk",7: "adopt",8: "run",9: "look"
    },{//food_2
        0: "apple",1: "juice",2: "banana",3: "noodle",4: "potato",5: "tomato",6: "ketchup",7: "mango",8: "rice",9: "orange"
    },{//tech_3
        0: "device",1: "laptop",2: "computer",3: "tablet",4: "monitor",5: "TV",6: "screen",7: "keyboard",8: "speaker",9: "cable"
    },{//objects_4
        0: "door",1: "table",2: "bed",3: "closet",4: "jacket",5: "T-shirt",6: "camera",7: "floor",8: "roof",9: "pillow"
    },{//animals_5
        0: "giraffe",1: "fox",2: "koala",3: "gorilla",4: "owl",5: "zebra",6: "kangaroo",7: "deer",8: "mouse",9: "lion"
    },{//jobs_6
        0: "artist",1: "astronaut",2: "chef",3: "doctor",4: "police",5: "teacher",6: "vet",7: "actor",8: "pilot",9: "farmer"
    },{//countries_7
        0: "algeria",1: "belgium",2: "canada",3: "dominica",4: "egypt",5: "france",6: "germany",7: "india",8: "japan",9: "mexico"
    },{//organs_8
        0: "eye",1: "hair",2: "nose",3: "mouth",4: "hand",5: "leg",6: "nail",7: "muscle",8: "elbow",9: "head"
    },{//idkwhattheyrecaleed_9
        0: "of",1: "on",2: "at",3: "for",4: "from",5: "to",6: "in",7: "under",8: "behind",9: "by"
    },{//objects_10
        0: "chair",1: "window",2: "desk",3: "wood",4: "iron",5: "box",6: "package",7: "light",8: "toy",9: "metal"
    },{//physics_11
        0: "speed",1: "acceleration",2: "sun",3: "earth",4: "distance",5: "time",6: "relative",7: "radio",8: "weight",9: "strength"
    },{//starwars_12
        0: "luke",1: "skywalker",2: "jedi",3: "sith",4: "darth",5: "vader",6: "saber",7: "cool",8: "Anakin",9: "yoda"
    },{//months_13
        0: "one",1: "two",2: "three",3: "4",4: "five",5: "june",6: "july",7: "august",8: "september",9: "october"
    },{//days_14
        0: "monday",1: "tuesday",2: "wednesday",3: "thursday",4: "friday",5: "saturday",6: "sunday",7: "summer",8: "fall",9: "winter"
    },{//games_15
        0: "roblox",1: "amongus",2: "fortnite",3: "apex",4: "fallout",5: "overwatch",6: "minecraft",7: "fallguys",8: "valorant",9: "tf2"
    },{//verbs_16
        0: "have",1: "is",2: "among",3: "vent",4: "type",5: "say",6: "arrange",7: "climb",8: "ramp",9: "play"
    },{//pronouns_17
        0: "him",1: "she",2: "us",3: "them",4: "their",5: "our",6: "your",7: "my",8: "me",9: "his"
    },{//idkatthispoint_18
        0: "ok",1: "wow",2: "yay",3: "huh",4: "woo",5: "what",6: "wee",7: "haha",8: "horray",9: "meh"
    },{//adjectives_19
        0: "smart",1: "fast",2: "creative",3: "swift",4: "quick",5: "cute",6: "perfect",7: "expensive",8: "cheap",9: "fancy"
    }
];


let check = new Command("verify");
check.set({
    aliases         : ["unverify"],
    description     : "Connects Roblox user with discord user",
    usage           : "verify",
    cooldown        : 10,
    unique          : false,
    category        : "roblox",
    worksInDMs      : true,
    isDevOnly       : false,
    requiredPerms   : "MANAGE_ROLES",
    isSlashCommand  : true,
    
});



check.execute = async (message, args, server, isSlash) =>{

    
    let isVerified = true;
    let authorId;
    if(isSlash)authorId = message.user.id;
    else authorId = message.author.id;
    const robloxBody = await getRobloxData(authorId).catch(err => isVerified = false);
    
    const messageFilter = m => !m.author.bot && m.author.id === authorId;
    const buttonFilter =  noob => noob.user.id === authorId && !noob.user.bot;

    const waitingButton = new MessageButton()
        .setCustomId('null')
        .setEmoji("🟢")
        .setLabel('Awaiting response')
        .setDisabled()
        .setStyle("SUCCESS")
    let listeningRow = new MessageActionRow().addComponents( waitingButton );

    if(isVerified){

        const updateButton = new MessageButton()
        .setCustomId('update')
        .setEmoji("🔁")
        .setLabel('Update Username')
        .setStyle('PRIMARY')
        const deleteButton = new MessageButton()
        .setCustomId('delete')
        .setEmoji("🗑")
        .setLabel('Remove account')
        .setStyle("DANGER")
        let row = new MessageActionRow().addComponents( updateButton, deleteButton);

        const confirmButton = new MessageButton()
        .setCustomId('true')
        .setEmoji("🔥")
        .setLabel('Confirm deletion')
        .setStyle('PRIMARY')
        const cancelButton = new MessageButton()
        .setCustomId('false')
        .setEmoji("❌")
        .setLabel('Cancel')
        .setStyle("PRIMARY")

        let booleanRow = new MessageActionRow().addComponents( confirmButton, cancelButton);
        

        let embed = makeEmbed(`Welcome back, ${robloxBody.cachedUsername}`,`How may I help you?`, server);
        embed.addField("Verified on",`<t:${parseInt(parseInt(robloxBody.firstVerified)/1000)}:D>`)
        embed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${robloxBody.robloxId}&width=420&height=420&format=png`);


        
        
        let newMsg = await message.reply({embeds: [embed], components: [row, listeningRow]}).catch(err=>err);
        if(!newMsg) newMsg = await message.fetchReply();

        const collector = newMsg.createMessageComponentCollector({ filter: buttonFilter, time: 40 * 1000 });
        

        collector.on('collect', async i => {
            i.update({components : []})

            switch (i.customId) {
                case "update":
                    let newUserInfo = await axios.get(`https://users.roblox.com/v1/users/${robloxBody.robloxId}`).catch(e=>e);
                    if(robloxBody.cachedUsername === newUserInfo.data.name){

                        let noDifEmbed = makeEmbed("No changes detected", "Your username appears to be the same since the last time you interacted with CrazyBot, so there is no updating I can do 🤷‍♂️", server)
                        message.channel.send({embeds:[noDifEmbed]});


                    } else {

                        await mongo().then(async (mongoose) =>{

                            try{ 
                                    
                                await verificationSchema.findOneAndUpdate({_id: authorId},{
                                    
                                    cachedUsername: newUserInfo.data.name,
                                    
                                },{upsert: false});

                                let yesDiffEmbed = makeEmbed("New username detected! ",`Your roblox username was changed from \`${robloxVerificationCache[authorId].cachedUsername}\` to \`${newUserInfo.data.name}\`. `,server)
                                message.channel.send({embeds:[yesDiffEmbed]});
                                robloxVerificationCache[authorId].cachedUsername = newUserInfo.data.name;
                                updateRobloxUser(message, authorId, server, false);
                                
                            } catch(error){

                                console.log(error);
                                let failed = makeEmbed("Error!",`And error happened while trying to connect to the database. Please try again.`,server)
                                message.channel.send({embeds:[failed]});
                                
                            }finally{
                                console.log("WROTE TOO DATABASE");
                                mongoose.connection.close();
                            }
                        });

                    }
                    
                    break;
                case "delete":
                    
                    message.channel.send({content: `Are you sure you want to remove your Roblox connection from CrazyBot's database?`, components: [booleanRow, listeningRow]})
                    .then( async m =>{

                        m.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 40, errors : ["time"] })

                        .then(async a =>{

                            
                            m.edit({components:[]});

                            if(a.customId === "true"){

                                await mongo().then(async (mongoose) =>{
                                    try { 
                                        await verificationSchema.findOneAndRemove({_id: authorId});
                                        delete robloxVerificationCache[authorId];
                                        
                            
                                        message.channel.send(`<@${authorId}> Your Roblox data have been deleted from CrazyBot's database. Roblox commands will no longer recognize you as being a verified user.`)
                                        updateRobloxUser(message, authorId, server, false, true);

                                    } finally{
                                        console.log("WROTE TO DATABASE");
                                        mongoose.connection.close();
                                    }
                                });
                                
                            } else {
                                
                                 m.edit({content: cancerCultureMessage, components:[]});
                            }
                        })
                        .catch(e=>{
                            console.log(e)
                            m.edit({content: cancerCultureMessage ,components:[]});
                        })
                    });
                    
                    break;
               
            }
        });


        collector.on('end', collected => {
            if(isSlash) message.editReply({components:[]}).catch(e=>e)//if e, message was deleted
            else newMsg.edit({components:[]}).catch(e=>e)//if e, message was deleted
        });
        

    } else{
        

        const confirmButton = new MessageButton()
        .setCustomId('true')
        .setLabel('Yes')
        .setStyle("SUCCESS")
        const rejectButton = new MessageButton()
        .setCustomId('false')
        .setLabel('No')
        .setStyle("DANGER")
        let booleanRow = new MessageActionRow().addComponents( confirmButton, rejectButton );

        const doneButton = new MessageButton()
        .setCustomId('true')
        .setLabel('Done')
        .setStyle("SUCCESS")
        const cancelButton = new MessageButton()
        .setCustomId('false')
        .setLabel('Cancel')
        .setStyle("DANGER")
        let confirmationRow = new MessageActionRow().addComponents( doneButton, cancelButton );

        
        let embed = makeEmbed(`Hello there!`,`Please enter your Roblox account's username to begin the verification process.`, server, false);
        

        message.reply({embeds: [embed], components: [listeningRow]})
        .then( async m =>{
            message.channel.awaitMessages({filter: messageFilter,  max : 1,time: 1000 * 40, errors : ["time"] })
            .then(async a=>{

                if(isSlash) message.editReply({components:[]});
                else m.edit({components:[]});

                
                
                let usernameData = await axios.get("https://api.roblox.com/users/get-by-username?username=" + a.first().content)
                
                
                
                if(usernameData.data?.Id){

                    let infoEmbed = makeEmbed("Is this you?","",server, false);
                    infoEmbed.addField("Username",usernameData.data.Username, true);
                    infoEmbed.addField("Id",""+usernameData.data.Id, true);
                    infoEmbed.addField("Profile link",`[CLICK HERE](https://www.roblox.com/users/${usernameData.data.Id}/profile)`,false);
                    infoEmbed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${usernameData.data.Id}&width=420&height=420&format=png`);

                    message.channel.send({embeds:[infoEmbed], components: [booleanRow, listeningRow]})
                    .then(m=>{
                        
                        m.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 40, errors : ["time"] })
                        .then(a=>{

                            
                            m.edit({components:[]});
                            

                            if(a.customId === "true"){
                               

                                let words = [];
                                for (let i = 0; i < authorId.length; i++) {
                                    words.push(randomWords[i][authorId[i]])
                                    
                                }

                                let altWords = ["verify", authorId, "and", `${usernameData.data.Id}`, "close"];
                                
                                let sentenceEmbed = makeEmbed("Verify that's you", `Please enter one of the following phrase into your "About" section in your Roblox profile: \n\n \`${words.join(" ")}\`\n\n **OR** \n\n \`${altWords.join(" ")}\``, server)
                                sentenceEmbed.setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${usernameData.data.Id}&width=420&height=420&format=png`);

                                sentenceEmbed.setImage("https://cdn.discordapp.com/attachments/926507472611582002/1034178689769943121/easterEgg.png");
                                
                                message.channel.send({embeds:[sentenceEmbed], components: [confirmationRow, listeningRow]})
                                .then(m=>{

                                    m.awaitMessageComponent({filter: buttonFilter,  max : 1,time: 1000 * 60 * 5, errors : ["time"] })
                                    .then(async a=>{

                                        
                                        m.edit({components:[]});

                                        let userInfo = await axios.get(`https://users.roblox.com/v1/users/${usernameData.data?.Id}`).catch(e=>e);
                                        

                                        if(userInfo?.data?.description){
                                            
                                            let description = userInfo.data.description.split(/\n/).join(" ").split(/ +/);
                                            
                                            let index = 0;
                                            let matches = [];
                                            for(let word of description){
                                                if(word === words[index]){
                                                    matches.push(words[index]);
                                                    index++
                                                } else if (word === altWords[index]){
                                                    matches.push(altWords[index]);
                                                    index++
                                                }
                                            }
                                            if(words.join("-") === matches.join("-") || altWords.join("-" === matches.join("-"))){

                                                robloxVerificationCache[authorId] = {robloxId : usernameData.data.Id, cachedUsername : usernameData.data.Username};
                                                
                                                await mongo().then(async (mongoose) =>{

                                                    try{ 
                                                            
                                                        await verificationSchema.findOneAndUpdate({_id: authorId},{
                                                            
                                                            robloxId :robloxVerificationCache[authorId].robloxId,
                                                            cachedUsername: robloxVerificationCache[authorId].cachedUsername,
                                                            firstVerified: Date.now()
                                                            
                                                        },{upsert: true});

                                                        let successEmbed = makeEmbed("Success ✅",`Your Roblox and Discord accounts have been connected successfully. \n If you want to remove/update your data, redo the command.`,server)
                                                        message.channel.send({embeds:[successEmbed]});
                                                        updateRobloxUser(message, authorId, server, false);
                                                        
                                                    } catch(error){

                                                        console.log(error);
                                                        let failed = makeEmbed("Error!",`And error happened while trying to connect to the database. Please try again.`,server)
                                                        message.channel.send({embeds:[failed]});
                                                        
                                                    }finally{
                                                        console.log("WROTE TOO DATABASE");
                                                        mongoose.connection.close();
                                                    }
                                                });
                                            } else {
                                                let nope = makeEmbed("Description does not match!",`The description/about section of that user does not match the provided phrase. Make sure the words are in the correct order and that there is at least 1 space between each word.`,server)
                                                message.channel.send({embeds:[nope]});
                                            }
                                            

                                        } else {

                                            message.channel.send({embeds:[makeEmbed("Command failed","An error occurred while getting data from roblox or your profile was empty!", server, false)]});

                                            
                                            if(isSlash) message.editReply({content: "Command expired", components:[]});
                                            else m.edit({content: "Command expired", components:[]});
                                        }

                                    })
                                    .catch(e=>{
                                        if(isSlash) message.editReply({components:[]});
                                        else m.edit({components:[]});
                                    })

                                }).catch(e=>console.log(e))
                                
                            } else {
                                m.channel.send("Please redo the command with your username.");
                            }
                        })
                        .catch(e=>{
                            
                            if(isSlash) message.editReply({content: "Command expired", components:[]});
                            else m.edit({content: "Command expired", components:[]});
                        })
                    })

                } else {
                    message.channel.send({embeds:[makeEmbed("Username not found","Could not find a Roblox user with that username!", server, false)]});
                    

                    
                    if(isSlash) message.editReply({content: "Command expired", components:[]});
                    else m.edit({content: "Command expired", components:[]});
                }
                
            })
            .catch(e=>{

                if(isSlash) message.editReply({content: "Command expired", components:[]});
                else m.edit({content: "Command expired", components:[]});
            })
        });
    }

    
    return true;

};

module.exports = check;