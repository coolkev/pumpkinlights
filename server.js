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

//app.get('/light/:number/:dir', function(req, res){
//    var lightNum = req.params.number;
//    var value =req.params.dir == 'on';
//    if (lightNum == 0)
//        shiftRegister.toggleAll(value);
//    else
//        shiftRegister.toggle(lightNum, value);
//    res.json({ success: true });
//});
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
    socket.on('togglelight', function (data) {
        console.log(data);

        if (data.number == 0)
            shiftRegister.toggleAll();
else
            shiftRegister.toggle(data.number);
    });
});

//# sourceMappingURL=server.js.map
