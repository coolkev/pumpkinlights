import gpio = require("gpio")

//var pinNum = parseInt(process.argv[2]);
//var value = parseInt(process.argv[3])==1;

var pin = new gpio.Pin(4);
pin.open(gpio.PinDirection.output);
pin.write(true);
pin.close();

//Pin connected to ST_CP of 74HC595
//var latchPin = new gpio.Pin(17); // 8;
////Pin connected to SH_CP of 74HC595
//var clockPin = new gpio.Pin(21);
//////Pin connected to DS of 74HC595
//var dataPin = new gpio.Pin(18);

//latchPin.open(gpio.PinDirection.output);
//clockPin.open(gpio.PinDirection.output);
//dataPin.open(gpio.PinDirection.output);

//latchPin.write(false);

//clockPin.write(false);
//dataPin.write(true);
//clockPin.write(true);

//latchPin.write(true);




//latchPin.close();
//clockPin.close();
//dataPin.close();
//latchPin.open();

//async.forEach

//var pin = new gpio.Pin(pinNum);
//var intervalTimer;

//pin.open(gpio.PinDirection.output, () => {

//    //for (var x = 0;
//    //pin.write(value, () =>
//    //    pin.close());

//    intervalTimer= setInterval(() => {
                
//        pin.write(value);
//        value = !value;

//    },50);


//});



//var rl = require('readline');
//var prompts = rl.createInterface(process.stdin, process.stdout);


//prompts.question("Hit Enter to exit...", function () {

//    clearInterval(intervalTimer);

//    //child.kill();

//    pin.write(false, () => {
//        pin.close(() => {

//            process.exit();
//        });
//    });

//});
