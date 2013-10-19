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

export interface ShiftRegisterSettings {
    latchPin: number;
    clockPin: number;
    dataPin: number;
    registerCount?: number;

}
export class ShiftRegister {


    //private prevValues: boolean[] = [];
    private pins: Pin[];
    private currentValue: number;
    private performWriteOrNoop : () => void;

    constructor(private settings: ShiftRegisterSettings) {

        if (!settings.registerCount)
            settings.registerCount = 8;

        this.performWriteOrNoop = this.write;


        this.pins = new Array(settings.registerCount);
        for (var x = 0; x < settings.registerCount; x++) {
            this.pins[x] = new Pin(x, (n,v)=>this.writePin(n,v));
        }

        this.initLights();



    }

    private initLights() {

        wiringpi.wiringPiSetup();

        wiringpi.pinMode(this.settings.latchPin, wiringpi.OUTPUT);
        wiringpi.pinMode(this.settings.clockPin, wiringpi.OUTPUT);
        wiringpi.pinMode(this.settings.dataPin, wiringpi.OUTPUT);

        this.currentValue = 0;
        this.write();

    }

    private writePin(num: number, value: boolean) {

        if (value)
            this.currentValue = bit_set(this.currentValue, num);
        else
            this.currentValue = bit_clear(this.currentValue, num);

        this.performWriteOrNoop();

    }


    private write() {

        //console.log('setting shiftregister value: ' + this.currentValue);

        wiringpi.digitalWrite(this.settings.latchPin, wiringpi.LOW);

        wiringpi.shiftOut(this.settings.dataPin, this.settings.clockPin, wiringpi.LSBFIRST, this.currentValue);
        wiringpi.shiftOut(this.settings.dataPin, this.settings.clockPin, wiringpi.LSBFIRST, 0);

        wiringpi.digitalWrite(this.settings.latchPin, wiringpi.HIGH);


    }


    public pin(num: number) {

        return this.pins[num];
    }


    public all(operation: (pin: Pin) => void) {

        //put writes on hold until all pins are updated
        this.performWriteOrNoop = () => { };

        this.pins.forEach(operation);

        //turn writes on hold until all pins are updated
        this.performWriteOrNoop = this.write;

        this.write();

    }

    //public getState(lightNum: number) {

    //    if (lightNum == 0)
    //        return this.currentValue != 0;            
    //    else
    //        return bit_test(this.currentValue, lightNum-1);
    //}

    //public toggle(lightNum: number) {

    //    if (lightNum == 0) {
    //        if (this.currentValue == 0)
    //            this.currentValue = Math.pow(2, 8) - 1;
    //        else
    //            this.currentValue = 0;
    //    }
    //    else
    //        this.currentValue = bit_toggle(this.currentValue, lightNum - 1);

    //    this.write();
        


    //}


    //public on(lightNum: number) {

    //    if (lightNum == 0)
    //        this.currentValue = Math.pow(2, 8) - 1;
    //    else
    //        this.currentValue = bit_set(this.currentValue, lightNum - 1);

    //    this.write();

    //}


    //public off(lightNum: number) {

        
    //    if (lightNum == 0)
    //        this.currentValue = 0;
    //    else
    //        this.currentValue = bit_clear(this.currentValue, lightNum-1);
    //    this.write();

    //}


}

export class Pin {

    private _state = false;
    //private _bitValue: number;

    constructor(public num: number, private write: (light:number, value: boolean)=>void) {

        //this._bitValue = Math.pow(2, num);

    }

    //public bitValue() {

    //    return this._bitValue;
    //}

    public state() {

        return this._state;
    }

    public on() {
        this.setState(true);

    }


    public off() {

        this.setState(false);

    }


    public setState(value: boolean) {

        this._state = value;
        this.write(this.num, value);

    }

    public toggle() {

        this.setState(!this._state);
        
    }

    private flickerTimer: number;

    private flickerBrightness: number;


    static Flicker_table = [10, 10, 20, 30, 30, 30, 40, 50, 60, 70, 80, 70, 70,     // the table that tells us how to flicker
        60, 60, 50, 50, 50, 60, 70, 80, 90, 100,
        120, 140, 160, 240, 250, 100, 150, 250, 250, 140,
        240, 230, 220, 100, 80, 70, 70, 70, 80, 80,
        140, 130, 120, 110, 200, 210, 220, 220, 100, 90,
        40, 30, 30, 30, 20, 10, 10];
    
    public flickerStart(brightness: number) {


        this.setState(true);
        
        this.flickerBrightness = 0;

        this.flickerTimer = setTimeout(() => this.flickerRoutine(), 1000)
        
        var rndTimer;
        var rndCounter = Math.floor((Math.random() * Pin.Flicker_table.length));;

        var rndChanger = () => {

            if (rndCounter >= Pin.Flicker_table.length-1)
                rndCounter = 0;
            else 
                rndCounter++;

            this.flickerBrightness = Pin.Flicker_table[rndCounter];

            var rndDelay = Math.floor((Math.random() * 40)+10);

            //console.log('changing brightness to ' + this.flickerBrightness + ' rndDelay=' + rndDelay);

            if (this.flickerTimer)
                rndTimer = setTimeout(rndChanger, rndDelay);


        };
        rndTimer = setTimeout(rndChanger, 1000);


    }


    public flickerStop() {

        this.setState(false);
        clearTimeout(this.flickerTimer);
        clearImmediate(this.flickerTimer);
        this.flickerTimer = null;
    }

    
    public flickerRoutine() {


        this.on();

        wiringpi.delayMicroseconds(this.flickerBrightness*40);

        this.off();

        wiringpi.delayMicroseconds(10000-(this.flickerBrightness*40));
            

        this.flickerTimer = setImmediate(() => this.flickerRoutine());
        


    }
   
}