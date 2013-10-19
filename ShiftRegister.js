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
    function ShiftRegister(latchPin, clockPin, dataPin, registerCount) {
        if (typeof registerCount === "undefined") { registerCount = 8; }
        this.latchPin = latchPin;
        this.clockPin = clockPin;
        this.dataPin = dataPin;
        this.registerCount = registerCount;
        this.initLights();
    }
    ShiftRegister.prototype.initLights = function () {
        wiringpi.wiringPiSetup();

        wiringpi.pinMode(this.latchPin, wiringpi.OUTPUT);
        wiringpi.pinMode(this.clockPin, wiringpi.OUTPUT);
        wiringpi.pinMode(this.dataPin, wiringpi.OUTPUT);

        this.currentValue = 0;
        this.write();
    };

    ShiftRegister.prototype.write = function () {
        //console.log('setting shiftregister value: ' + this.currentValue);
        wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);

        wiringpi.shiftOut(this.dataPin, this.clockPin, wiringpi.LSBFIRST, this.currentValue);
        wiringpi.shiftOut(this.dataPin, this.clockPin, wiringpi.LSBFIRST, 0);

        wiringpi.digitalWrite(this.latchPin, wiringpi.HIGH);
    };

    ShiftRegister.prototype.getState = function (lightNum) {
        if (lightNum == 0)
            return this.currentValue != 0;
else
            return bit_test(this.currentValue, lightNum - 1);
    };

    ShiftRegister.prototype.toggle = function (lightNum) {
        if (lightNum == 0) {
            if (this.currentValue == 0)
                this.currentValue = Math.pow(2, 8) - 1;
else
                this.currentValue = 0;
        } else
            this.currentValue = bit_toggle(this.currentValue, lightNum - 1);

        this.write();
    };

    ShiftRegister.prototype.on = function (lightNum) {
        if (lightNum == 0)
            this.currentValue = Math.pow(2, 8) - 1;
else
            this.currentValue = bit_set(this.currentValue, lightNum - 1);

        this.write();
    };

    ShiftRegister.prototype.off = function (lightNum) {
        if (lightNum == 0)
            this.currentValue = 0;
else
            this.currentValue = bit_clear(this.currentValue, lightNum - 1);
        this.write();
    };
    return ShiftRegister;
})();
exports.ShiftRegister = ShiftRegister;

//# sourceMappingURL=ShiftRegister.js.map
