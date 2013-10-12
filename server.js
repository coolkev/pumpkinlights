var http = require('http');
var fs = require('fs');
wiringpi = require("wiringpi");

var path = '/home/pi/app/';

//Pin connected to ST_CP of 74HC595
var latchPin = 7;

////Pin connected to SH_CP of 74HC595
var clockPin = 11;

//////Pin connected to DS of 74HC595
var dataPin = 12;

var prevValues = [];

var spawn = require('child_process').spawn;
var musicChild;

function initLights() {
    wiringpi.wiringPiSetup();

    wiringpi.pinMode(latchPin, wiringpi.OUTPUT);
    wiringpi.pinMode(clockPin, wiringpi.OUTPUT);
    wiringpi.pinMode(dataPin, wiringpi.OUTPUT);

    wiringpi.digitalWrite(latchPin, wiringpi.LOW);

    for (var x = 0; x < 8; x++) {
        wiringpi.digitalWrite(clockPin, wiringpi.LOW);
        wiringpi.digitalWrite(dataPin, wiringpi.LOW);
        wiringpi.digitalWrite(clockPin, wiringpi.HIGH);
        prevValues[x] = false;
    }
}

function toggleLight(lightNum, value) {
    wiringpi.digitalWrite(latchPin, wiringpi.LOW);

    console.log("toggleLight: ", lightNum, value);

    for (var x = 0; x < 8; x++) {
        var curValue;
        if (lightNum == x + 1) {
            curValue = value;
            prevValues[x] = value;
        } else {
            curValue = prevValues[x];
        }
        wiringpi.digitalWrite(clockPin, wiringpi.LOW);

        wiringpi.digitalWrite(dataPin, curValue ? wiringpi.HIGH : wiringpi.LOW);

        wiringpi.digitalWrite(clockPin, wiringpi.HIGH);
    }

    wiringpi.digitalWrite(latchPin, wiringpi.HIGH);
}

initLights();

http.createServer(function (req, resp) {
    //resp.write("Hello World");
    //resp.end();
    console.log("request: " + req.url);

    if (req.url.match(/^\/light\//)) {
        var args = req.url.split('/');

        var lightNum = args[2];
        var value = args[3] == 'on';

        if (lightNum == 0)
            prevValues = [value, value, value, value, value, value, value, value];

        toggleLight(lightNum, value);

        resp.writeHead(200, { "Content-Type": "text/html" });
        resp.write('light');
        resp.end();
    } else if (req.url.match(/^\/music\//)) {
        var args = req.url.split('/');
        var start = args[2] == 'start';

        if (start) {
            console.log('starting music');

            musicChild = spawn('mpg321', [path + 'The Nightmare Before Christmas - This is Halloween.mp3']);
        } else if (musicChild) {
            console.log('stopping music');

            musicChild.kill();
        }
    } else {
        var file = path + req.url;
        if ((file).charAt(file.length - 1) == '/')
            file += 'index.html';

        fs.exists(file, function (exists) {
            if (exists) {
                resp.writeHead(200, { "Content-Type": "text/html" });

                fs.readFile(file, "utf8", function (err, data) {
                    resp.write(data);
                    resp.end();
                });
            } else {
                resp.writeHead(404, { "Content-Type": "text/html" });
                resp.write("Not found");
                resp.end();
            }
        });
    }
}).listen(80);
//# sourceMappingURL=server.js.map
