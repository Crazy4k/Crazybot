module.exports = function checkRoles(respnse,num = 0) {
    let args  = respnse.first().content.split(/ +/);
    
    if(args[num]) {
        if(!isNaN(parseInt(args[num])) && args[num].length >= 17){
            if(respnse.first().guild.roles.cache.get(args[num])) {
                return args[num];
            } else return "not valid";
            
        } else if(respnse.first().mentions.roles.first()){
            return respnse.first().mentions.roles.first().id;
        }if(args[num].toLowerCase() === "0"){
            return "cancel"
        }else if(args[num].toLowerCase() === "no"){
            return "no"
        }else return "not useable";
    } else return "no args";
}