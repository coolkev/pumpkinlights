import wiringpi = require('wiringpi');

//export module shiftregister {

function bit_test(num: number, bit: number) {
    return ((num >> bit) % 2 != 0)
}

function bit_set(num: number, bit: number) {
    return num | 1 << bit;
}

function bit_clear(num: number, bit: number) {
    return num & ~(1 << bit);
}

function bit_toggle(num: number, bit: number) {
    return num ^= (1 << bit);
}

export class ShiftRegister {


    //private prevValues: boolean[] = [];

    private currentValue: number;

    constructor(private latchPin: number, private clockPin: number, private dataPin: number, private registerCount = 8) {

        this.initLights();
    }

    private initLights() {

        wiringpi.wiringPiSetup();


        
        
        wiringpi.pinMode(this.latchPin, wiringpi.OUTPUT);
        wiringpi.pinMode(this.clockPin, wiringpi.OUTPUT);
        wiringpi.pinMode(this.dataPin, wiringpi.OUTPUT);

        this.currentValue = 0;
        this.write();

    }

    private write() {

        //console.log('setting shiftregister value: ' + this.currentValue);

        wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);

        wiringpi.shiftOut(this.dataPin, this.clockPin, wiringpi.LSBFIRST, this.currentValue);
        wiringpi.shiftOut(this.dataPin, this.clockPin, wiringpi.LSBFIRST, 0);

        wiringpi.digitalWrite(this.latchPin, wiringpi.HIGH);


    }

    public getState(lightNum: number) {

        if (lightNum == 0)
            return this.currentValue != 0;            
        else
            return bit_test(this.currentValue, lightNum-1);
    }

    public toggle(lightNum: number) {

        if (lightNum == 0) {
            if (this.currentValue == 0)
                this.currentValue = Math.pow(2, 8) - 1;
            else
                this.currentValue = 0;
        }
        else
            this.currentValue = bit_toggle(this.currentValue, lightNum - 1);

        this.write();
        


    }


    public on(lightNum: number) {

        if (lightNum == 0)
            this.currentValue = Math.pow(2, 8) - 1;
        else
            this.currentValue = bit_set(this.currentValue, lightNum - 1);

        this.write();

    }


    public off(lightNum: number) {

        
        if (lightNum == 0)
            this.currentValue = 0;
        else
            this.currentValue = bit_clear(this.currentValue, lightNum-1);
        this.write();

    }


}

//export class Pin {

//    private _state = false;
//    private _bitValue: number;

//    constructor(public num: number, private shiftRegister: ShiftRegister) {

//        this._bitValue = Math.pow(2, num);

//    }

//    public state() {

//        return this._state;
//    }

//    public on() {

//        if (lightNum == 0)
//            this.currentValue = Math.pow(2, 8) - 1;
//        else
//            this.currentValue = bit_set(this.currentValue, lightNum - 1);

//        shiftRegister.write();

//    }


//    public off() {


//        if (lightNum == 0)
//            this.currentValue = 0;
//        else
//            this.currentValue = bit_clear(this.currentValue, lightNum - 1);
//        this.write();

//    }



//}