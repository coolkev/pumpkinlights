var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require//,
    //gpio: './gpio.js'
});

requirejs(['wiringpi'],
function (wiringpi) {
    //foo and bar are loaded according to requirejs
    //config, but if not found, then node's require
    //is used to load the module.
  
    wiringpi.wiringPiSetup();
    wiringpi.pinMode(7, wiringpi.OUTPUT);

    for (var x = 0; x < 5000; x++) {
        wiringpi.digitalWrite(7, wiringpi.HIGH);

        wiringpi.digitalWrite(7, wiringpi.LOW);
    }
    

});