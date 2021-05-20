module.exports = (respnse,num = 0) => {
    let args  = respnse.first().content.split(/ +/);
    
    if(args[num]) {
        if(!isNaN(parseInt(args[num])) && args[num].length >= 17){
            if(respnse.first().guild.channels.cache.get(args[num])) {
                return args[num];
            } else return "not valid";
            
        } else if(respnse.first().mentions.channels.first()){
            return respnse.first().mentions.channels.first().id;
        }if(args[num].toLowerCase() === "0"){
            return "cancel"
        }else if(args[num].toLowerCase() === "no"){
            return "no"
        }else if(args[num].toLowerCase() === "here"){
            return respnse.first().channel.id;
        
        }else return "not useable";
    } else return "no args";
}