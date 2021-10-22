const {Permissions} = require("discord.js");

let obj = {
    aliases : undefined,
    description : undefined,
    cooldown : 3,
    category : undefined,
    whiteList : Permissions.FLAGS.SEND_MESSAGES,
    unique : undefined,
    worksInDMs : false,
    isDevOnly : false,
    isSlashCommand :  false,
    isTestOnly : false,
    usage : undefined,
    requiredArgs : [],
    requiredPerms : Permissions.FLAGS.SEND_MESSAGES
}//Default options^^

module.exports = class Command{
	constructor(name){
		this.name = name;
        this.aliases = undefined;
		this.description = undefined;
		this.cooldown = undefined;
		this.category = undefined;
		this.whiteList = undefined;
		this.unique = undefined;
		this.worksInDMs = undefined;
        this.isDevOnly = undefined;
        this.isSlashCommand = undefined;
        this.isTestOnly = undefined;
        this.usage = undefined;
        this.requiredArgs = [];
        this.requiredPerms = Permissions.FLAGS.SEND_MESSAGES;
	}//pass object as an argument with values that you want

    set = function(object ){
        for(let property in obj){
            this[property] = obj[property];
        }
        for(let property in object){
            this[property] = object[property];
        }
    }//setting the default values first then overwriting them with the given ones so that if you dont provide a property, it will convert into the default one
    
}
