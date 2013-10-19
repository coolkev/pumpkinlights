declare module "wiringpi" {


    function wiringPiSetup(): number;

    function pinMode(pinnum: number, direction: number);

    function digitalWrite(pinnum: number, value: number);
    function delay(ms: number);

    export var OUTPUT: number;
    export var INPUT: number;
    
    export var HIGH: number;
    export var LOW: number;
    export var LSBFIRST: number;
    export var MSBFIRST: number;
     
    
    function shiftOut(dataPin: number, clockPin: number, order: number, value: number);

}