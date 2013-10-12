var http = require('http');

var express = require('express');

//import routes = require('./routes');
//import user = require('./routes/user');
var path = require('path');

var shiftregister = require("./ShiftRegister");

var apppath = '/home/pi/app/';

var spawn = require('child_process').spawn;
var musicChild;

var shiftRegister = new shiftregister.ShiftRegister(7, 11, 12);

var app = express();
app.set('port', process.env.PORT || 80);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/light/:number/:dir', function (req, res) {
    var lightNum = req.params.number;

    var value = req.params.dir == 'on';

    if (lightNum == 0)
        shiftRegister.toggleAll(value);
else
        shiftRegister.toggle(lightNum, value);

    //toggleLight(lightNum, value);
    //var r = <http.ServerResponse><any>res;
    //    r.writeHead(200, { "Content-Type": "text/html" });
    //    r.write('number=' + lightNum);
    //    r.write(',light=' + value);
    //    r.end();
    res.json({ success: true });
});

app.get('/music/:action', function (req, res) {
    var start = req.params.action == 'start';

    if (start) {
        console.log('starting music');

        musicChild = spawn('mpg321', [apppath + 'The Nightmare Before Christmas - This is Halloween.mp3']);
    } else if (musicChild) {
        console.log('stopping music');

        musicChild.kill();
    }

    res.json({ success: true });
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

//# sourceMappingURL=server.js.map
