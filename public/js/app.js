var pumpkinlights;
(function (pumpkinlights) {
    $(document).ready(function () {
        var socket = io.connect('http://192.168.0.55/');

        var touchstartevent = navigator.userAgent.match('iPhone') ? 'touchstart' : 'mousedown';
        var touchendevent = navigator.userAgent.match('iPhone') ? 'touchend' : 'mouseup';

        //var state: boolean[] = [];
        $('.lights label').each(function (i, e) {
            $(e).bind(touchstartevent, function () {
                socket.emit('togglestart', { number: i });
            });

            $(e).bind(touchendevent, function () {
                socket.emit('toggleend', { number: i });
            });
        });

        $('#playmusic').click(function () {
            $.get('/music/start');
        });

        $('#stopmusic').click(function () {
            $.get('/music/stop');
        });

        var keyDown = [];
        $(document).keydown(function (evt) {
            if (evt.which >= 96 && evt.which <= 104) {
                var i = evt.which - 96;

                if (!keyDown[i]) {
                    socket.emit('togglestart', { number: i });
                    keyDown[i] = true;
                }
            }
        });
        $(document).keyup(function (evt) {
            if (evt.which >= 96 && evt.which <= 104) {
                var i = evt.which - 96;

                if (keyDown[i]) {
                    socket.emit('toggleend', { number: i });
                    keyDown[i] = false;
                }
            }
        });
    });
})(pumpkinlights || (pumpkinlights = {}));
//# sourceMappingURL=app.js.map
