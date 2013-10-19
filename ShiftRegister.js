var wiringpi = require('wiringpi');

//export module shiftregister {
var ShiftRegister = (function () {
    function ShiftRegister(latchPin, clockPin, dataPin, registerCount) {
        if (typeof registerCount === "undefined") { registerCount = 8; }
        this.latchPin = latchPin;
        this.clockPin = clockPin;
        this.dataPin = dataPin;
        this.registerCount = registerCount;
        this.prevValues = [];
        this.initLights();
    }
    ShiftRegister.prototype.initLights = function () {
        wiringpi.wiringPiSetup();

        wiringpi.pinMode(this.latchPin, wiringpi.OUTPUT);
        wiringpi.pinMode(this.clockPin, wiringpi.OUTPUT);
        wiringpi.pinMode(this.dataPin, wiringpi.OUTPUT);

        wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);

        wiringpi.shiftOut(this.dataPin, this.clockPin, wiringpi.LSBFIRST, 0);

        wiringpi.digitalWrite(this.latchPin, wiringpi.HIGH);

        //wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);
        //    console.log('shifting out...' + 1);
        //    wiringpi.shiftOut(this.dataPin, this.clockPin, wiringpi.LSBFIRST, 1);
        //    wiringpi.digitalWrite(this.latchPin, wiringpi.HIGH);
        //var output = 3 << 2;
        //var output = 1 << 0;
        //for (var x = 0; x <=5 ; x++) {
        //    wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);
        //    var value = Math.pow(2, x);
        //    console.log('shifting out...' + value);
        //    wiringpi.shiftOut(this.dataPin, this.clockPin, wiringpi.LSBFIRST, value);
        //    wiringpi.digitalWrite(this.latchPin, wiringpi.HIGH);
        //    wiringpi.delay(500);
        //}
        wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);

        var value = Math.pow(2, 1) + Math.pow(2, 0);

        console.log('shifting out...' + value);

        wiringpi.shiftOut(this.dataPin, this.clockPin, wiringpi.LSBFIRST, value);
        wiringpi.shiftOut(this.dataPin, this.clockPin, wiringpi.LSBFIRST, 0);
        wiringpi.digitalWrite(this.latchPin, wiringpi.HIGH);
        //for (var x = 0; x < this.registerCount; x++) {
        //    wiringpi.digitalWrite(this.clockPin, wiringpi.LOW);
        //    wiringpi.digitalWrite(this.dataPin, wiringpi.LOW);
        //    wiringpi.digitalWrite(this.clockPin, wiringpi.HIGH);
        //    this.prevValues[x] = false;
        //}
    };

    ShiftRegister.prototype.toggleAll = function () {
        var value = true;
        for (var x = 0; x < this.registerCount; x++) {
            if (this.prevValues[x]) {
                value = false;
                break;
            }
        }

        for (x = 0; x < this.registerCount; x++) {
            this.prevValues[x] = value;
        }
        this.toggle(0);
    };

    ShiftRegister.prototype.toggle = function (lightNum) {
        wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);

        for (var x = 0; x < this.registerCount; x++) {
            var curValue;
            if (lightNum == x + 1) {
                curValue = !this.prevValues[x];
                this.prevValues[x] = curValue;
            } else {
                curValue = this.prevValues[x];
            }
            wiringpi.digitalWrite(this.clockPin, wiringpi.LOW);

            wiringpi.digitalWrite(this.dataPin, curValue ? wiringpi.HIGH : wiringpi.LOW);

            wiringpi.digitalWrite(this.clockPin, wiringpi.HIGH);
        }

        wiringpi.digitalWrite(this.latchPin, wiringpi.HIGH);
    };

    ShiftRegister.prototype.on = function (lightNum) {
        this.onoff(lightNum, true);
    };

    ShiftRegister.prototype.off = function (lightNum) {
        this.onoff(lightNum, false);
    };

    ShiftRegister.prototype.onoff = function (lightNum, on) {
        wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);

        for (var x = 0; x < this.registerCount; x++) {
            wiringpi.digitalWrite(this.clockPin, wiringpi.LOW);

            var curValue;
            if (lightNum == x + 1) {
                curValue = on;
                this.prevValues[x] = curValue;
            } else {
                curValue = this.prevValues[x];
            }
            wiringpi.digitalWrite(this.dataPin, curValue ? wiringpi.HIGH : wiringpi.LOW);

            wiringpi.digitalWrite(this.clockPin, wiringpi.HIGH);
        }

        wiringpi.digitalWrite(this.latchPin, wiringpi.HIGH);
    };
    return ShiftRegister;
})();
exports.ShiftRegister = ShiftRegister;

var Pin = (function () {
    function Pin(num) {
        this.num = num;
        this._state = false;
        this._bitValue = Math.pow(2, num);
    }
    Pin.prototype.state = function () {
        return this._state;
    };

    Pin.prototype.write = function (value) {
    };
    return Pin;
})();
exports.Pin = Pin;

//# sourceMappingURL=ShiftRegister.js.map
