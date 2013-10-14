import wiringpi = require('wiringpi');

//export module shiftregister {


    export class ShiftRegister {


        private prevValues: boolean[] = [];

        constructor(private latchPin: number, private clockPin: number, private dataPin: number) {

            this.initLights();
        }

        private initLights() {

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



        }

        public toggleAll() {


            var value = !(this.prevValues[1] || this.prevValues[2] || this.prevValues[3] || this.prevValues[4] || this.prevValues[5]);

            this.prevValues = [value, value, value, value, value, value, value, value];
            this.toggle(0);
        }

        public toggle(lightNum: number) {

            //var value = !this.prevValues[lightNum];

            wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);

            //console.log("toggleLight: ", lightNum, value);

            for (var x = 0; x < 8; x++) {

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