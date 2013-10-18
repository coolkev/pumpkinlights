import wiringpi = require('wiringpi');

//export module shiftregister {


    export class ShiftRegister {


        private prevValues: boolean[] = [];

        constructor(private latchPin: number, private clockPin: number, private dataPin: number, private registerCount = 8) {

            this.initLights();
        }

        private initLights() {

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


        }

        public toggleAll() {

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
        }

        public toggle(lightNum: number) {

            //var value = !this.prevValues[lightNum];

            wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);

            //console.log("toggleLight: ", lightNum, value);

            for (var x = 0; x < this.registerCount; x++) {

                var curValue;
                if (lightNum == x + 1) {
                    curValue = !this.prevValues[x];
                    console.log("toggleLight: ", lightNum, curValue);
                    this.prevValues[x] = curValue;

                }
                else {
                    curValue = this.prevValues[x];
                }
                wiringpi.digitalWrite(this.clockPin, wiringpi.LOW);

                wiringpi.digitalWrite(this.dataPin, curValue ? wiringpi.HIGH : wiringpi.LOW);

                wiringpi.digitalWrite(this.clockPin, wiringpi.HIGH);
            }


            wiringpi.digitalWrite(this.latchPin, wiringpi.HIGH);



        }



    }
//}