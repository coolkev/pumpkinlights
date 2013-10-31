declare var io: any;

module pumpkinlights {

    $(document).ready(function () {

         var socket = <Socket>io.connect('http://192.168.0.55/');

        var touchstartevent = navigator.userAgent.match('iPhone') ? 'touchstart' : 'mousedown';
        var touchendevent = navigator.userAgent.match('iPhone') ? 'touchend' : 'mouseup';

        //var state: boolean[] = [];
        $('.lights label').each(function (i,e ) {

            
            $(e).bind(touchstartevent, function (evt:JQueryMouseEventObject) {
                if (evt.clientX >= 200) {
                    socket.emit('flickerStart', {
                        number: i, brightness: parseInt($('#brightness').val())
                    });
                }
                else {
                    socket.emit('lightOn', {
                        number: i
                    });
                }
            });

            $(e).bind(touchendevent, function () {

                socket.emit('lightOff', { number: i });

            });
        });

        $('#playmusic').click(function () {
            socket.emit('playMusic');

        });

        $('#stopmusic').click(function () {
            socket.emit('stopMusic');

           // $.get('/music/stop');


        });

        $('#shutdown').click(function () {

            if (confirm('Are you sure you want to shut down the Pi?'))
                socket.emit('shutdown');


        });



        
        var keyDown: boolean[] = [];
        $(document).keydown(function (evt) {
            //96 = 0

            if (evt.which >= 96 && evt.which <= 104) {
                var i = evt.which - 96;

                if (!keyDown[i]) {
                    socket.emit('togglestart', { number: i });
                    keyDown[i] = true;
                }
            }

        });
         $(document).keyup(function (evt) {
            //96 = 0

            if (evt.which >= 96 && evt.which <= 104) {
                var i = evt.which - 96;

                if (keyDown[i]) {
                    socket.emit('toggleend', { number: i });
                    keyDown[i] = false;
                }
            }

        });


    });


}