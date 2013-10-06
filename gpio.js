var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "fs", 'events'], function(require, exports, __fs__, __events__) {
    var fs = __fs__;
    
    var events = __events__;

    var gpiopath = '/sys/class/gpio/';

    function logError(source, e) {
        console.log(source, e.message, e.name);
    }

    exports.logging = true;

    var logMessage = exports.logging ? function () {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        console.log.apply(console, args);
    } : function () {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
    };

    function writeFile(file, data, onsuccess, retries, onfail) {
        if (typeof retries === "undefined") { retries = 0; }
        //fs.writeFile(file, data, callback);
        var error;
        for (var x = 0; x <= retries; x++) {
            try  {
                fs.writeFileSync(file, data, { flag: 'w+' });
                onsuccess();
                return;
            } catch (e) {
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

    (function (PinDirection) {
        PinDirection[PinDirection["output"] = 0] = "output";
        PinDirection[PinDirection["input"] = 1] = "input";
    })(exports.PinDirection || (exports.PinDirection = {}));
    var PinDirection = exports.PinDirection;

    var Pin = (function (_super) {
        __extends(Pin, _super);
        function Pin(pinNum, direction) {
            if (typeof direction === "undefined") { direction = PinDirection.output; }
            _super.call(this);
            this.pinNum = pinNum;
            this.direction = direction;

            var pinPath = gpiopath + 'gpio' + pinNum;
            this.path = {
                pin: pinPath,
                value: pinPath + '/value',
                direction: pinPath + '/direction'
            };
        }
        Pin.prototype.getPinNum = function () {
            return this.pinNum;
        };

        Pin.prototype.getDirection = function () {
            return this.direction;
        };

        Pin.prototype.setDirection = function (dir, callback) {
            var _this = this;
            //var self = this, path = this.PATH.DIRECTION;
            //if (typeof dir !== "string" || dir !== "in") dir = "out";
            this.direction = dir;

            var newDir = dir == PinDirection.output ? 'out' : 'in';

            logMessage('Setting direction "' + newDir + '" on gpio' + this.pinNum);
            fs.readFile(this.path.direction, "utf-8", function (err, data) {
                if (err)
                    logError('readFile: ' + _this.path.direction, err);

                if (newDir === data) {
                    logMessage('Current direction is already ' + dir);
                } else {
                    writeFile(_this.path.direction, newDir, function () {
                        callback();
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
                        //}
                        //self.emit('directionChange', dir);
                    }, 10);
                }
            });
        };
        Pin.prototype.open = function (dir, callback) {
            var _this = this;
            logMessage('opening gpio' + this.path.pin);

            if (fs.exists(this.path.pin)) {
                // already exported, unexport and export again
                logMessage('Header already exported');

                this.setDirection(dir, callback);
                //return true;
                //_unexport(n, function () { _export(n, fn); });
            } else {
                var onSuccess = function () {
                    logMessage('opened gpio' + _this.pinNum);

                    _this.setDirection(dir, callback);
                };

                var onFail = function (err) {
                    logMessage('Error: ' + err + ' will try to close and reopen...');
                    _this.close(function () {
                        logMessage('closed');

                        writeFile(gpiopath + 'export', _this.pinNum, onSuccess);
                    });
                };

                writeFile(gpiopath + 'export', this.pinNum, onSuccess, 0, onFail);
            }
        };

        Pin.prototype.write = function (value, callback) {
            var _this = this;
            if (this.direction == PinDirection.output) {
                if (this.value !== value) {
                    var iValue = value ? "1" : "0";
                    writeFile(this.path.value, iValue, function () {
                        _this.value = value;
                        _this.emit('valueChange', iValue);
                        _this.emit('change', iValue);
                        if (typeof callback === 'function')
                            callback();
                    }, 10);
                }
            } else {
                logMessage('cannot write: pin direction set to in');
            }
        };

        Pin.prototype.read = function (callback) {
            var _this = this;
            fs.readFile(this.path.value, "utf-8", function (err, data) {
                if (err) {
                    err['path'] = _this.path.value;
                    err['action'] = 'read';
                    logError('readFile: ' + _this.path.value, err);
                } else {
                    if (typeof callback === "function")
                        callback(data);
else
                        logMessage("value: ", data);
                }
            });
        };

        Pin.prototype.close = function (callback) {
            logMessage('closing gpio' + this.pinNum);

            writeFile(gpiopath + 'unexport', this.pinNum, callback, 10);
        };
        return Pin;
    })(events.EventEmitter);
    exports.Pin = Pin;
});
//# sourceMappingURL=gpio.js.map
