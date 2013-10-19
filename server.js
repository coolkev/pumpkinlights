var http = require('http');

var express = require('express');

//import routes = require('./routes');
//import user = require('./routes/user');
var path = require('path');

var shiftregister = require("./ShiftRegister");

var apppath = '/home/pi/app/';

var spawn = require('child_process').spawn;
var musicChild;

var shiftRegister = new shiftregister.ShiftRegister(7, 11, 12, 16);

var app = express();
app.set('port', process.env.PORT || 80);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/music/:action', function (req, res) {
    var start = req.params.action == 'start';

    if (start) {
        console.log('starting music');

        if (musicChild)
            musicChild.kill();

        musicChild = spawn('mpg321', [apppath + 'The Nightmare Before Christmas - This is Halloween.mp3']);
    } else if (musicChild) {
        console.log('stopping music');

        musicChild.kill();
        musicChild = null;
    }

    res.json({ success: true });
});

var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

var io = require("socket.io");

io.listen(server).sockets.on('connection', function (socket) {
    //socket.emit('news', { hello: 'world' });
    //socket.on('togglelight', function (data) {
    //    console.log(data);
    //    if (data.number == 0)
    //        shiftRegister.toggleAll();
    //    else
    //        shiftRegister.toggle(data.number);
    //});
    var flickerTimers = [];
    socket.on('togglestart', function (data) {
        var lightNum = data.number;

        var flickr = function () {
            shiftRegister.toggle(data.number);

            var isOn = shiftRegister.getState(data.number);

            var maxRnd = isOn ? 500 : 20;
            var minRnd = isOn ? 1000 : 5;

            var rnd = Math.floor((Math.random() * maxRnd) + minRnd);

            console.log('flicker: light: ' + data.number + ' state: ' + isOn + ' maxRnd: ' + maxRnd + ' minRnd: ' + minRnd + ' rnd: ' + rnd);

            flickerTimers[data.number] = setTimeout(flickr, rnd);
        };

        shiftRegister.on(lightNum);

        flickerTimers[data.number] = setTimeout(flickr, 500);
    });

    socket.on('toggleend', function (data) {
        //shiftRegister.toggle(data.number);
        clearTimeout(flickerTimers[data.number]);
        flickerTimers[data.number] = null;
        shiftRegister.off(data.number);
    });
});

//# sourceMappingURL=server.js.map
