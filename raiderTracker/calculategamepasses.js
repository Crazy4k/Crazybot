const fs = require("fs")
function read(string){
    let obj =  fs.readFileSync(string, "utf-8");
    return JSON.parse(obj); 
}


module.exports = function calculatGamepasses(arrayOfOwnedGamepasses){
    const {MS1, MS2} = read("./raiderTracker/gamepasses.json");

    let int = 0;
    for(let gamepass of arrayOfOwnedGamepasses){
        if(MS1[gamepass])int += MS1[gamepass].power;
        else if(MS2[gamepass])int += MS2[gamepass].power; 
    }//bro how does this works again?
    if(int > 10)int = 10;
    return int;
}