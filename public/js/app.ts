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
            socket.emit('playMusic', {
                file: $('#musicFiles').val()
            });

        });
        
        $('#stopmusic').click(function () {
            socket.emit('stopMusic');

           // $.get('/music/stop');


        });

        $('#saveRecording').click(function () {

            var name = prompt('Enter filename', $('#savedRecordings').val())

            if (name) {
                socket.emit('saveRecording', { file: name });
                $('#savedRecordings').append($('<option/>').text(name)).val(name);

                
            }
            // $.get('/music/stop');


        });

        $('#startPlayback').click(function () {
            socket.emit('startPlayback', { file: $('#savedRecordings').val() } );

        });
        $('#stopPlayback').click(function () {
            socket.emit('stopPlayback');

        });
        $('#shutdown').click(function () {

            if (confirm('Are you sure you want to shut down the Pi?'))
                socket.emit('shutdown');

	  });

        socket.emit('getSavedRecordings', (files: string[]) => {

            $('#savedRecordings').append($.map(files, m=> $('<option/>').text(m)));

        });
        socket.emit('getMusicFiles', (files: string[]) => {

            $('#musicFiles').append($.map(files, m=> $('<option/>').text(m)));

        });
        
        var keyDown: boolean[] = [];
        $(document).keydown(function (evt) {
            //96 = 0

            //console.log('keydown: ', evt.which);

            //var i = null;
            //if (evt.which >= 96 && evt.which <= 104) {
            //    i = evt.which - 96;

            //} else if (evt.which >= 48 && evt.which <= 56) {
            //    i = evt.which - 48;

            //}


            //if (i !== null && !keyDown[i]) {
            //    socket.emit('lightOn', { number: i });
            //    keyDown[i] = true;
            //}

            var i = translateKey(evt.which);
            
            if (i !== null && !keyDown[i]) {
                socket.emit('lightOn', { number: i });
                keyDown[i] = true;
            }


        });


         
         $(document).keyup(function (evt) {
            //96 = 0
             // 48 = 0

            // var i = null;

            //if (evt.which >= 96 && evt.which <= 104) {
            //    i = evt.which - 96;

            //}
            //else if (evt.which >= 48 && evt.which <= 56) {
            //    i = evt.which - 48;

            //}
             
            // if (i!==null && keyDown[i]) {
            //     socket.emit('lightOff', { number: i });
            //     keyDown[i] = false;
            // }


             var i = translateKey(evt.which);

             if (i !== null && keyDown[i]) {
                 socket.emit('lightOff', { number: i });
                 keyDown[i] = false;
             }

        });


    });


    function translateKey(char: number) {

        switch (char) {

            case 65:
            case 74:
                return 1;

            case 83:
            case 75:
                return 2;

            case 68:
            case 76:
                return 3;

            case 70:
            case 186:
                return 4;

            case 71:
            case 72:
                return 5;
            
            case 32:
                return 0;

        }

        return null;

    }

}