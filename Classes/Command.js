let obj = {
    aliases : undefined,
    description : undefined,
    cooldown : undefined,
    category : undefined,
    whiteList : undefined,
    unique : undefined,
    worksInDMs : undefined,
    isDevOnly : undefined,
    isSlashCommand :  undefined,
    isTestOnly : undefined,
    usage : undefined
}
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
        this.requiredArgs
	}
    set = function(object = obj){
        for(let property in object){
            this[property] = object[property];
        }
    }
    
}
