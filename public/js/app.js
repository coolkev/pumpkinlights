var pumpkinlights;
(function (pumpkinlights) {
    $(document).ready(function () {
        var socket = io.connect('http://192.168.0.55/');

        var touchevent = navigator.userAgent.match('iPhone') ? 'touchstart' : 'mousedown';

        //var state: boolean[] = [];
        $('.lights label').each(function (i, e) {
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

        $(document).keydown(function (evt) {
            if (evt.which >= 96 && evt.which <= 104) {
                var i = evt.which - 96;

                //state[i] = !state[i];
                socket.emit('togglelight', { number: i });
            }
        });
    });
})(pumpkinlights || (pumpkinlights = {}));
//# sourceMappingURL=app.js.map
