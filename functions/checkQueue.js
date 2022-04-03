const botCache = require("../caches/botCache");
const fs = require("fs")

async function myPromise(){
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(botCache.isOnRobloxCooldown);
        }, 7500);
    });
    return promise;
}

module.exports = async () => {

    let bool = botCache.isOnRobloxCooldown

    while(bool){
        bool = await myPromise()
    }
}