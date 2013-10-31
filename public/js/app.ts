declare var io: any;

module pumpkinlights {

    $(document).ready(function () {

         var socket = io.connect('http://192.168.0.55/');

        var touchevent = navigator.userAgent.match('iPhone') ? 'touchstart' : 'mousedown';

        //var state: boolean[] = [];
        $('.lights label').each(function (i,e ) {

            
            $(e).bind(touchevent, function () {

                socket.emit('togglelight', { number: i });
                
            });
        });

        $('#playmusic').click(function () {

            $.get('/music/start');


        });

        $('#stopmusic').click(function () {

            $.get('/music/stop');


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