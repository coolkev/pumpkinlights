module pumpkinlights {

    $(document).ready(function () {

        for (var x = 0; x < 8; x++) {

            $('.lights').append($('<label><input type="checkbox" value="' + (x + 1) + '" /> ' + (x + 1) + '</label>'));

        }


        $('.lights input').click(function () {

            $.get('/light/' + this.value + '/' + (this.checked ? 'on' : 'off'));

            if (this.value == 0) {
                $('.lights input:gt(0)').prop('checked', this.checked);
            }
        });

        $('#playmusic').click(function () {

            $.get('/music/start');


        });

        $('#stopmusic').click(function () {

            $.get('/music/stop');


        });


        $(document).keydown(function (evt) {
            //96 = 0

            if (evt.which >= 96 && evt.which <= 104) {
                var index = evt.which - 96;
                var chk = $('.lights input:eq(' + index + ')');
                chk.click();
            }

        });
    });


}