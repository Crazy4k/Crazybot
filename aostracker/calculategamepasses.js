const {MS1,MS2} = require("./gamepasses.json");

module.exports = function calculatGamepasses(arrayOfOwnedGamepasses){
    let int = 0;
    for(let gamepass of arrayOfOwnedGamepasses){
        if(MS1[gamepass])int += MS1[gamepass].power;
        else if(MS2[gamepass])int += MS2[gamepass].power; 
    }
    if(int > 10)int = 10;
    return int;
}