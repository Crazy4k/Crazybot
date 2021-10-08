const raiderGroups = require("./raiderGroups.json");


//MS1 BORDER = 2988554876
//MS1 CITY = 3145176353
//MS1 APARTMENTS = 4454445210
//MS1 PALACE = 4146579025
//MS2 BORDER = 4771888361
//MS2 CITY = 5103000243


module.exports ={
    findAosGroups: (groups, AosOrKos) =>{
        let cleanArry = [];
        for(let groupData of raiderGroups){
            let group = groups.find(grp=>grp.Id === groupData.id)
            if(group){
                cleanArry.push(group);
                AosOrKos = groupData.status;
            }
        }

        return [cleanArry,AosOrKos]; 
    },
    whatPlace: (id)=> {
        let str = ""
        switch (id) {
            case "2988554876":
                str = "MS1 border"
                break;
            case "3145176353":
                str = "MS1 City"
                break;
            case "4454445210":
                str = "MS1 Apartments"
                break;
            case "4146579025":
                str = "MS1 Palace"
                break;
            case "4771888361":
                str = "MS2 border"
                break;
            case "5103000243":
                str = "MS2 city"
                break;
        
            default:
                str = "Unknown"
                break;
        }
        return str;
    }
}