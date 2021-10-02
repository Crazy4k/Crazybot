
module.exports = function calculatGamepasses(arrayOfOwnedGamepasses){
    let int = 0;
    for(let gamepass of arrayOfOwnedGamepasses){
        switch (gamepass) {
            case "Jet Pack":
                int += 2;
                break;
            case "Ak-4k Hog Blaster":
                int += 3;
                break;
            case "Ghost":
                int += 2;
                break;
            case "Grouch":
                int += 1.5;
                break;
            case "Raider Bundle":
                int += 1.5;
                break;
            case "Mafia Boss":
                int += 0.25;
                break;
            case "Snow man":
                int += 1;
                break;
            case "Bunny":
                int += 2;
                break;
            case "Grim Reaper":
                int += 1;
                break;
            case "Santa":
                int += 0.5;
                break;
            case "Icy shotgun":
                int += 0.25;
                break;
            case "Skeleton":
                int += 1;
                break;
            case "AWP":
                int += 1;
                break;
            case "Alien":
                int += 3;
                break;
            case "PPSH41":
                int += 0.5;
                break;
            case "Mecha":
                int += 1;
                break;
            case "RPG":
                int += 1.5;
                break;
            case "Hitman":
                int += 0.25;
                break;
            case "Juggernaut V1":
                int += 1.5;
                break;
            case "Grenade Laucher":
                int += 1.5;
                break;

            //MS 2 gamepasses


            case "Mad Scientist":
                int += 1;
                break;
            case "AK-47m":
                int += 1.5;
                break;
            case "AR15":
                int += 2;
                break;
            case "Heavy Sniper":
                int += 3;
                break;
            case "Operator":
                int += 1.5;
                break;
            case "Juggernaut V2":
                int += 3;
                break;
            case "Rocket Launcher":
                int += 3;
                break;
                
        
            default:
                break;
        }
    }
    if(int > 10)int = 10;
    return int;
}