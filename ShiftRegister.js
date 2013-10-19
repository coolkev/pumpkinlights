var wiringpi = require('wiringpi');

//export module shiftregister {
function bit_test(num, bit) {
    return ((num >> bit) % 2 != 0);
}

function bit_set(num, bit) {
    return num | 1 << bit;
}

function bit_clear(num, bit) {
    return num & ~(1 << bit);
}

function bit_toggle(num, bit) {
    return num ^= (1 << bit);
}

var ShiftRegister = (function () {
    function ShiftRegister(settings) {
        var _this = this;
        this.settings = settings;
        if (!settings.registerCount)
            settings.registerCount = 8;

        this.performWriteOrNoop = this.write;

        this.pins = new Array(settings.registerCount);
        for (var x = 0; x < settings.registerCount; x++) {
            this.pins[x] = new Pin(x, function (n, v) {
                return _this.writePin(n, v);
            });
        }

        this.initLights();
    }
    ShiftRegister.prototype.initLights = function () {
        wiringpi.wiringPiSetup();

        wiringpi.pinMode(this.settings.latchPin, wiringpi.OUTPUT);
        wiringpi.pinMode(this.settings.clockPin, wiringpi.OUTPUT);
        wiringpi.pinMode(this.settings.dataPin, wiringpi.OUTPUT);

        this.currentValue = 0;
        this.write();
    };

    ShiftRegister.prototype.writePin = function (num, value) {
        if (value)
            this.currentValue = bit_set(this.currentValue, num);
else
            this.currentValue = bit_clear(this.currentValue, num);

        this.performWriteOrNoop();
    };

    ShiftRegister.prototype.write = function () {
        //console.log('setting shiftregister value: ' + this.currentValue);
        wiringpi.digitalWrite(this.settings.latchPin, wiringpi.LOW);

        wiringpi.shiftOut(this.settings.dataPin, this.settings.clockPin, wiringpi.LSBFIRST, this.currentValue);
        wiringpi.shiftOut(this.settings.dataPin, this.settings.clockPin, wiringpi.LSBFIRST, 0);

        wiringpi.digitalWrite(this.settings.latchPin, wiringpi.HIGH);
    };

    ShiftRegister.prototype.pin = function (num) {
        return this.pins[num];
    };

    ShiftRegister.prototype.all = function (operation) {
        //put writes on hold until all pins are updated
        this.performWriteOrNoop = function () {
        };

        this.pins.forEach(operation);

        //turn writes on hold until all pins are updated
        this.performWriteOrNoop = this.write;

        this.write();
    };
    return ShiftRegister;
})();
exports.ShiftRegister = ShiftRegister;

var Pin = (function () {
    //private _bitValue: number;
    function Pin(num, write) {
        this.num = num;
        this.write = write;
        this._state = false;
        //static Flicker_table = [10, 10, 10, 10, 20, 30, 30, 30, 40, 50, 60, 70, 80, 90, 100, // The table for our normal glowing
        //    110, 120, 130, 140, 150, 160, 170, 180, 190, 200,
        //    210, 220, 230, 240, 250, 250, 250, 250, 250, 250,
        //    240, 230, 220, 210, 200, 190, 180, 170, 160, 150,
        //    140, 130, 120, 110, 100, 90, 80, 70, 60, 50,
        //    40, 30, 30, 30, 20, 10, 10, 10, 10];
        this.maxDelay = 8000;
        this.multiplier = this.maxDelay / 250;
        //this._bitValue = Math.pow(2, num);
    }
    //public bitValue() {
    //    return this._bitValue;
    //}
    Pin.prototype.state = function () {
        return this._state;
    };

    Pin.prototype.on = function () {
        this.setState(true);
    };

    Pin.prototype.off = function () {
        this.setState(false);

        if (this.flickerTimer) {
            clearTimeout(this.flickerTimer);
            clearImmediate(this.flickerTimer);
            this.flickerTimer = null;
        }
    };

    Pin.prototype.setState = function (value) {
        this._state = value;
        this.write(this.num, value);
    };

    Pin.prototype.toggle = function () {
        this.setState(!this._state);
    };

    Pin.prototype.flickerStart = function (brightness) {
        var _this = this;
        var rndTimer;
        var rndCounter = Math.floor((Math.random() * Pin.Flicker_table.length));
        ;

        this.flickerBrightness = Pin.Flicker_table[rndCounter];

        this.flickerRoutine();

        var rndChanger = function () {
            if (rndCounter >= Pin.Flicker_table.length - 1)
                rndCounter = 0;
else
                rndCounter++;

            _this.flickerBrightness = Pin.Flicker_table[rndCounter];

            var rndDelay = Math.floor((Math.random() * 50) + 20);

            if (_this.flickerTimer)
                rndTimer = setTimeout(rndChanger, rndDelay);
        };
        rndTimer = setTimeout(rndChanger, 500);
    };

    Pin.prototype.flickerRoutine = function () {
        var _this = this;
        this.on();

        wiringpi.delayMicroseconds(this.flickerBrightness * this.multiplier);

        this.off();

        wiringpi.delayMicroseconds(this.maxDelay - (this.flickerBrightness * this.multiplier));

        this.flickerTimer = setImmediate(function () {
            return _this.flickerRoutine();
        });
    };
    Pin.Flicker_table = [
        10,
        10,
        20,
        30,
        30,
        30,
        40,
        50,
        60,
        70,
        80,
        70,
        70,
        60,
        60,
        50,
        50,
        50,
        60,
        70,
        80,
        90,
        100,
        120,
        140,
        160,
        240,
        250,
        100,
        150,
        250,
        250,
        140,
        240,
        230,
        220,
        100,
        80,
        70,
        70,
        70,
        80,
        80,
        140,
        130,
        120,
        110,
        200,
        210,
        220,
        220,
        100,
        90,
        40,
        30,
        30,
        30,
        20,
        10,
        10
    ];
    return Pin;
})();
exports.Pin = Pin;

//# sourceMappingURL=ShiftRegister.js.map
