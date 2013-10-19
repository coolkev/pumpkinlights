var http = require('http');

var express = require('express');

//import routes = require('./routes');
//import user = require('./routes/user');
var path = require('path');

var shiftregister = require("./ShiftRegister");

var apppath = '/home/pi/app/';

var spawn = require('child_process').spawn;
var musicChild;

var shiftRegister = new shiftregister.ShiftRegister({ latchPin: 7, clockPin: 11, dataPin: 12, registerCount: 16 });

var app = express();
app.set('port', process.env.PORT || 80);
app.use(express.static(path.join(__dirname, 'public')));

//app.get('/music/:action', function (req, res) {
//    var start = req.params.action == 'start';
//    if (start) {
//        console.log('starting music');
//        if (musicChild)
//            musicChild.kill();
//        musicChild = spawn('mpg321', [apppath + 'The Nightmare Before Christmas - This is Halloween.mp3']);
//    }
//    else if (musicChild) {
//        console.log('stopping music');
//        musicChild.kill();
//        musicChild = null;
//    }
//    res.json({ success: true });
//});
var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

var io = require("socket.io");

io.listen(server).sockets.on('connection', function (socket) {
    socket.on('flickerStart', function (data) {
        var lightNum = data.number;

        if (lightNum == 0)
            shiftRegister.all(function (m) {
                return m.on();
            });
else
            shiftRegister.pin(lightNum - 1).flickerStart(data.brightness);
    });

    //socket.on('flickerStop', function (data) {
    //    var lightNum = data.number;
    //    if (lightNum == 0)
    //        shiftRegister.all(m=> m.off());
    //    else
    //        shiftRegister.pin(lightNum - 1).off();
    //});
    socket.on('lightOn', function (data) {
        var lightNum = data.number;

        if (lightNum == 0)
            shiftRegister.all(function (m) {
                return m.on();
            });
else
            shiftRegister.pin(lightNum - 1).on();
    });

    socket.on('lightOff', function (data) {
        var lightNum = data.number;

        if (lightNum == 0)
            shiftRegister.all(function (m) {
                return m.off();
            });
else
            shiftRegister.pin(lightNum - 1).off();
    });

    socket.on('playMusic', function (data) {
        console.log('starting music');

        if (musicChild)
            musicChild.kill();

        musicChild = spawn('mpg321', [apppath + 'The Nightmare Before Christmas - This is Halloween.mp3']);
    });

    socket.on('stopMusic', function (data) {
        console.log('stopping music');

        musicChild.kill();
        musicChild = null;
    });
});

//# sourceMappingURL=server.js.map
