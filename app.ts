

wiringpi = require("wiringpi");

wiringpi.wiringPiSetup();

//Pin connected to ST_CP of 74HC595
var latchPin = 7; // 04
////Pin connected to SH_CP of 74HC595
var clockPin = 11; //CS1
//////Pin connected to DS of 74HC595
var dataPin = 12; //MOSI

wiringpi.pinMode(latchPin, wiringpi.OUTPUT);
wiringpi.pinMode(clockPin, wiringpi.OUTPUT);
wiringpi.pinMode(dataPin, wiringpi.OUTPUT);

    wiringpi.digitalWrite(latchPin, wiringpi.LOW);

    var toTurnOn = process.argv.splice(2);

for (var x = 0; x < 8; x++) {

    var turnOn = false;
    for (var y = 0; y < toTurnOn.length; y++) {
        if (<any>toTurnOn[y] == x+1) {
            turnOn = true;
            break;
        }
    }

    wiringpi.digitalWrite(clockPin, wiringpi.LOW);
    wiringpi.digitalWrite(dataPin, turnOn ? wiringpi.HIGH : wiringpi.LOW);
    wiringpi.digitalWrite(clockPin, wiringpi.HIGH);
}


    wiringpi.digitalWrite(latchPin, wiringpi.HIGH);
