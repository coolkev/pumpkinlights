define(["require", "exports", "gpio"], function(require, exports, __gpio__) {
    var gpio = __gpio__;

    var pinNum = parseInt(process.argv[2]);
    var value = parseInt(process.argv[3]) == 1;

    var pin = new gpio.Pin(pinNum);
    var intervalTimer;

    pin.open(gpio.PinDirection.output, function () {
        //for (var x = 0;
        //pin.write(value, () =>
        //    pin.close());
        intervalTimer = setInterval(function () {
            pin.write(value);
            value = !value;
        }, 50);
    });

    var rl = require('readline');
    var prompts = rl.createInterface(process.stdin, process.stdout);

    prompts.question("Hit Enter to exit...", function () {
        clearInterval(intervalTimer);

        //child.kill();
        pin.write(false, function () {
            pin.close(function () {
                process.exit();
            });
        });
    });
});
//# sourceMappingURL=app.js.map
