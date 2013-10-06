import fs = require("fs")
import util = require('util')
import events = require('events')

    var gpiopath = '/sys/class/gpio/';

function logError(source: string, e: Error) {
    console.log(source, e.message, e.name);
}

    exports.logging = true;

    var logMessage = exports.logging ? (...args: any[]) => { console.log.apply(console, args) } : (...args: any[]) => { };


function writeFile(file: string, data, retries: number = 0) {

    var error;
    for (var x = 0; x <=retries; x++) {
        try {
            fs.writeFileSync(file, data, { flag: 'w+' });
            return;
        }
        catch (e) {
            logMessage('writeFile retrying ' + file);
            error = e;
        }

    }
    if (error) {
        logError('writeFile: ' + file, error);

        throw error;

    }
}
function writeFileX(file: string, data, onsuccess: ()=>void, retries: number = 0, onfail?: (err) =>void) {

    //fs.writeFile(file, data, callback);
    var error;
    for (var x = 0; x <=retries; x++) {
        try {
            fs.writeFileSync(file, data, { flag: 'w+' });
            onsuccess();
            return;
        }
        catch (e) {
            logMessage('writeFile retrying ' + file);
            error = e;
            //callback(e);
        }

    }
    if (error) {
        if (onfail)
            onfail(error);
        else 
            logError('writeFile: ' + file, error);

    }
}

    export enum PinDirection {
        output,
        input
    }


export class Pin extends events.EventEmitter {



    private path: {
        pin: string;
        value: string;
        direction: string;
    };

    constructor(private pinNum: number, private direction: PinDirection = PinDirection.output) {
        super();

        var pinPath = gpiopath + 'gpio' + pinNum;
        this.path = {
            pin: pinPath,
            value: pinPath + '/value',
            direction: pinPath + '/direction'
        };


    }

    public getPinNum() {

        return this.pinNum;
    }

    public getDirection() {
        return this.direction;
    }

    public setDirection(dir: PinDirection) {
        //var self = this, path = this.PATH.DIRECTION;
        //if (typeof dir !== "string" || dir !== "in") dir = "out";
        this.direction = dir;

        var newDir = dir == PinDirection.output ? 'out' : 'in';

        logMessage('Setting direction "' + newDir + '" on gpio' + this.pinNum);

        try {
            var data = fs.readFileSync(this.path.direction, "utf-8");

            if (newDir === data) {
                logMessage('Current direction is already ' + dir);
            } else {


                writeFile(this.path.direction, newDir);

                if (dir === PinDirection.input) {
                    // watch for value changes only for direction "in"
                    // since we manually trigger event for "out" direction when setting value
                    //self.valueWatcher = new FileWatcher(self.PATH.VALUE, self.interval, function (val) {
                    //    val = parseInt(val, 10);
                    //    self.value = val;
                    //    self.emit("valueChange", val);
                    //    self.emit("change", val);
                    //});
                } else {
                    // if direction is "out", try to clear the valueWatcher
                    //if (self.valueWatcher) {
                    //    self.valueWatcher.stop();
                    //    self.valueWatcher = null;
                    //}
                }
            }

        }
        catch (err) {
            logError('readFile: ' + this.path.direction, err);

        }


    }
    public open(dir: PinDirection) {

        logMessage('opening gpio' + this.path.pin);

        if (fs.exists(this.path.pin)) {
            // already exported, unexport and export again
            logMessage('Header already exported');

            this.setDirection(dir);

            //return true;
            //_unexport(n, function () { _export(n, fn); });
        } else {

            var onSuccess = () => {
                logMessage('opened gpio' + this.pinNum);

                this.setDirection(dir);
            };

            var onFail = (err) => {


            };
            try {
                writeFile(gpiopath + 'export', this.pinNum);
                onSuccess();
            }
            catch (err) {
                
                logMessage('Error: ' + err + ' will try to close and reopen...');
                this.close();

                writeFile(gpiopath + 'export', this.pinNum);
                onSuccess();

            }
        }


    }

    private value: boolean;

    public write(value: boolean) {


        // if direction is out, just emit change event since we can reliably predict
        // if the value has changed; we don't have to rely on watching a file
        if (this.direction == PinDirection.output) {

            //logMessage('writing value ' + value + ' to ' + this.pinNum);

            if (this.value !== value) {

                var iValue = value ? "1" : "0";
                writeFile(this.path.value, iValue);
                this.value = value;
                this.emit('valueChange', iValue);
                this.emit('change', iValue);
                
            }
        }
        else {

            logMessage('cannot write: pin direction set to in');

        }


    }


    //public read(callback: (value: number) => void) {
    //    fs.readFile(this.path.value, "utf-8", (err, data) => {
    //        if (err) {
    //            err['path'] = this.path.value;
    //            err['action'] = 'read';
    //            logError('readFile: ' + this.path.value, err);
    //        } else {
    //            if (typeof callback === "function") callback(data);
    //            else logMessage("value: ", data);
    //        }
    //    });

    //}


    public close() {

        logMessage('closing gpio' + this.pinNum);

        writeFile(gpiopath + 'unexport', this.pinNum, 10);
    }

}