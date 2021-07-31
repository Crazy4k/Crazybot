var { Timer } = require("easytimer.js");
let timer = new Timer();
timer.start();


module.exports = [timer.getTimeValues(), timer.getTotalTimeValues()]
