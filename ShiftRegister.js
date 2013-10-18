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

        for (var x = 0; x < this.registerCount; x++) {
            wiringpi.digitalWrite(this.clockPin, wiringpi.LOW);
            wiringpi.digitalWrite(this.dataPin, wiringpi.LOW);
            wiringpi.digitalWrite(this.clockPin, wiringpi.HIGH);
            this.prevValues[x] = false;
        }

        wiringpi.digitalWrite(this.latchPin, wiringpi.HIGH);
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
        //var value = !this.prevValues[lightNum];
        wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);

        for (var x = 0; x < this.registerCount; x++) {
            var curValue;
            if (lightNum == x + 1) {
                curValue = !this.prevValues[x];
                console.log("toggleLight: ", lightNum, curValue);
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
    return ShiftRegister;
})();
exports.ShiftRegister = ShiftRegister;

//# sourceMappingURL=ShiftRegister.js.map
