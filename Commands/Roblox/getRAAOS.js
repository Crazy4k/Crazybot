
const getRanks = require("../../aostracker/getRanks")
const makeEmbed = require("../../functions/embed");
const noblox = require("noblox.js");
const colors = require("../../colors.json");

module.exports = {
	name : 'moaio',
	description : "Membership of an Illegal Organisation. Scans all the current AOS and KoS groups for TSU branch members. Useful for TSU hicoms.",
    aliases:[,"aosintsu","kosintsu",],
    category:"roblox",
    worksInDMs: true,
    cooldown: 2*60,
    unique: true,
	usage:'moaio',
	async execute(message, args, server ) {
        //if(!args.length){
            const embed1 = makeEmbed("Scanning...","Gathering raider groups members...", server);
            const embed7 = makeEmbed("Error!...",`An error occurred while connecting with the Roblox API, please try again.`,colors.failRed);

            message.channel.send({embeds:[embed1]})
            .then(async msg1 =>{
                try {
                    
                    
                    const raiders = await getRanks([9723651,8224374,2981881,10937425,8675204,7033913]);
                    let allGroups = [... new Set([...raiders])]
        
                    const embed2 = makeEmbed("Scanning...",`Checking group data for ${allGroups.length} individuals.\n This might take a minute.`, server);
                    const embed3 = makeEmbed("Scanning...",`Assembling all data together...`,server);
                   
                
                    let inAOS = [];
                    let coolString = [];
                    msg1.edit({embeds:[embed2]}).then(async msg2=>{
                        let iter = allGroups.length / 50;
                        let data = [];
                        try {
                            for (let i = 0; i < iter; i++) {
                                let shit = allGroups;
                                let poopArray = shit.slice(i * 50, i*50+50);
                                let smolData = await Promise.all(poopArray.map(id => noblox.getGroups(id) )).catch(e=>{console.log(e); msg2.edit({embeds:[embed7]});});
                                
                                if(smolData)data.push(...smolData);              
                            }
                        } catch (error) {
                            console.error();
                            msg2.edit({embeds:[embed7]});
                        }
                        

                        let usersObject = {}
                        for (let i = 0; i < allGroups.length; i++) {
                            usersObject[allGroups[i]] = data[i];
                        }

                         for(let id in usersObject) {
                            let groups = usersObject[id];
                            let branchGroup
                            if(groups)branchGroup = groups.find(group=>group.Id === 4802792 || group.Id === 4901723 || group.Id === 4849580);
                            
                            //RA = 4802792
                            //Mili = 4901723
                            //CPSU = 4849580
                            if(branchGroup) inAOS.push(id);
                            
                        }
                        msg2.edit({embeds:[embed3]}).then(async msg3=>{
                            for(let id of inAOS){
                            
                                coolString.push(`${await noblox.getUsernameFromId(id).catch(e=>{msg2.edit({embeds:[embed7]});})}\n`);
                            }
                            if(!coolString.length)coolString.push("There is suspiciously no AOS/KOS members in any brach at all.")
                            const embed5 = makeEmbed(`Done ✅`, `**Here is a list a AoS/KoS members who are in a TSU branch:**\n\n${coolString.join(" ")}`, colors.successGreen);
                            message.channel.send({content:`<@${message.author.id}>`,embeds:[embed5]})
                            msg3.edit("Done.");
                            return true;
                        });
                        
                    })
                    
                
                return true;
                } catch (error) {
                    console.error();
                    msg1.edit({embeds:[embed7]});
                }

            
            })
            return true;
       /* } else{
            const embed1 = makeEmbed("Scanning...","Gathering groups members...", server);

            message.channel.send({embeds:[embed1]})
            .then(async msg1 =>{
                let arrayOfIds = [];
                let undup = [...new Set(args)];
                
                
                for(let e of undup){
                    const group = await noblox.getGroup(e)
                    if(group){
                        if(group.memberCount < 1000){
                            arrayOfIds.push(...await getRanks(e));
                        } else{
                            const embed = makeEmbed("Group member count too large to scan through.",`Group member count must be below 1000 members.`,server);
                            msg1.edit({content: "Failed.", embeds:[]});
                            sendAndDelete(message,embed, server);
                            return false;
                        }
                        
                    } else{
                        const embed = makeEmbed("Invalid group ID",`${e} is not a vaild group id.`,server);
                        msg1.edit({content: "Failed.", embeds:[]});
                        sendAndDelete(message,embed, server);
                        return false;
                    }
                }
                const embed2 = makeEmbed("Scanning...",`Checking group data for ${arrayOfIds.length} individuals.\nThis might take a few minutes.\n Progress: 0/${arrayOfIds.length}`, server);
                const embed3 = makeEmbed("Scanning...",`Assembling all data together...`,server);
                
            
                let inAOS = [];
                let coolString = [];
                msg1.edit({embeds:[embed2]}).then(async msg2=>{
                    for (let i = 0; i < arrayOfIds.length; i++) {
                        const id = arrayOfIds[i];
                        const groups = await noblox.getGroups(id);
                    
                        let RA = groups.find(group=>group.Id === 4802792);
                        let Militsiya = groups.find(group=>group.Id === 4901723);
                        let CPSU = groups.find(group=>group.Id === 4849580);
                
                        if(RA || Militsiya || CPSU) inAOS.push(id);
                        if(i % 20 === 0) {
                            embed2.setDescription(`Checking group data for ${arrayOfIds.length} individuals.\nThis might take a few minutes.\n Progress: ${i}/${arrayOfIds.length}`);
                            msg2.edit({embeds:[embed2]});
                        }
                        
                    }
                    msg2.edit({embeds:[embed3]}).then(async msg3=>{
                        for(let id of inAOS){
                        
                            coolString.push(`${await noblox.getUsernameFromId(id)}\n`);
                        }
                        if(!coolString.length)coolString.push("There is suspiciously no AOS/KOS members in any brach at all...")
                        const embed5 = makeEmbed("Done ✅", `${coolString.join(" ")}`, colors.successGreen);
                        message.channel.send({embeds:[embed5]})
                        msg3.edit("Done.");
                        return true;
                    });
                    
                })
                console.log(arrayOfIds)
            });
        
            
            return false;
        
        }*/
    }
    
    
};