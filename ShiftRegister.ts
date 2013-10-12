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

        public toggleAll(value: boolean) {

            this.prevValues = [value, value, value, value, value, value, value, value];
            this.toggle(0, value);
        }

        public toggle(lightNum: number, value: boolean) {


            wiringpi.digitalWrite(this.latchPin, wiringpi.LOW);

            console.log("toggleLight: ", lightNum, value);

            for (var x = 0; x < 8; x++) {

                var curValue;
                if (lightNum == x + 1) {
                    curValue = value;
                    this.prevValues[x] = value;

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