var wiringpi = require('wiringpi');

//export module shiftregister {
var ShiftRegister = (function () {
    function ShiftRegister(latchPin, clockPin, dataPin) {
        this.latchPin = latchPin;
        this.clockPin = clockPin;
        this.dataPin = dataPin;
        this.prevValues = [];
        this.initLights();
    }
    ShiftRegister.prototype.initLights = function () {
        wiringpi.wiringPiSetup();

        wiringpi.pinMode(this.latchPin, wiringpi.OUTPUT);
        wiringpi.pinMode(this.clockPin, wiringpi.OUTPUT);
        wiringpi.pinMode(this.dataPin, wiringpi.OUTPUT);

        wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);

        for (var x = 0; x < 8; x++) {
            wiringpi.digitalWrite(this.clockPin, wiringpi.LOW);
            wiringpi.digitalWrite(this.dataPin, wiringpi.LOW);
            wiringpi.digitalWrite(this.clockPin, wiringpi.HIGH);
            this.prevValues[x] = false;
        }
    };

    ShiftRegister.prototype.toggleAll = function (value) {
        this.prevValues = [value, value, value, value, value, value, value, value];
        this.toggle(0, value);
    };

    ShiftRegister.prototype.toggle = function (lightNum, value) {
        wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);

        console.log("toggleLight: ", lightNum, value);

        for (var x = 0; x < 8; x++) {
            var curValue;
            if (lightNum == x + 1) {
                curValue = value;
                this.prevValues[x] = value;
            } else {
                curValue = this.prevValues[x];
            }
            wiringpi.digitalWrite(this.clockPin, wiringpi.LOW);

            wiringpi.digitalWrite(this.dataPin, curValue ? wiringpi.HIGH : wiringpi.LOW);

            wiringpi.digitalWrite(this.clockPin, wiringpi.HIGH);
        }

        wiringpi.digitalWrite(this.latchPin, wiringpi.HIGH);
    };
    return ShiftRegister;
})();
exports.ShiftRegister = ShiftRegister;

//# sourceMappingURL=ShiftRegister.js.map
