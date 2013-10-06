define(["require", "exports", "gpio"], function(require, exports, __gpio__) {
    var gpio = __gpio__;

    //var pinNum = parseInt(process.argv[2]);
    //var value = parseInt(process.argv[3])==1;
    var pin = new gpio.Pin(4);
    pin.open(gpio.PinDirection.output);
    pin.write(true);
    pin.close();
});
//# sourceMappingURL=app.js.map
