import http = require('http');
import fs = require('fs');
import express = require('express');
import path = require('path');
import wiringpi = require('wiringpi');
import shiftregister = require('ShiftRegister');
import io = require("socket.io");

module pumpkinlights {

    var apppath = '/home/pi/app/';

    var spawn = require('child_process').spawn;
    var musicChild;


    var shiftRegister = new shiftregister.ShiftRegister({ latchPin: 7, clockPin: 11, dataPin: 12, registerCount: 16 });


    var app = express();
    app.set('port', process.env.PORT || 80);
    app.use(express.static(path.join(__dirname, 'public')));


    var server = http.createServer(app);
    server.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });

    var currentMusicFile: string;

    var recording: RecordedEvent[];
    //var startTime: number;
    var lastTime: number;

    function recordEvent(action: string, num: number) {

        if (recording) {
            var time = new Date().getTime();

            recording.push({ action: action, num: num, ms: time - lastTime });
            //lastTime = time;
        }
    }
    io.listen(server).sockets.on('connection', function (socket) {

        var events = ['flickerStart', 'lightOn', 'lightOff'];

        events.forEach(m=> {

            socket.on(m, function (data) {


                var lightNum = data.number;
                recordEvent(m, lightNum);

                pumpkinlights[m](lightNum);


            });

        });

        socket.on('playMusic', function (data) {
            console.log('starting music');

            currentMusicFile = data.file;

            playMusic(data.file);

            recording = [];
            lastTime = new Date().getTime();

        });

        socket.on('stopMusic', function (data) {
            console.log('stopping music');

            stopMusic();

        });



        socket.on('startPlayback', function (data) {
            console.log('startPlayback');

            if (data.file) {
                startPlayback(data.file);
            }
            else {
                playMusic(currentMusicFile);

                replayRecording(0);
            }
        });



        socket.on('stopPlayback', function (data) {
            console.log('stopPlayback');

            if (playbackTimer) {
                clearTimeout(playbackTimer);
            }

            stopMusic();

        });

        socket.on('getSavedRecordings', function (fn: (s: string[]) => void) {
            console.log('getSavedRecordings');

            fs.readdir(apppath + 'recordings', (err, files) => {
                fn(files);
            });
        });

        socket.on('getMusicFiles', function (fn: (s: string[]) => void) {
            console.log('getMusicFiles');

            fs.readdir(apppath + 'music', (err, files) => {
                fn(files);
            });
        });

        socket.on('saveRecording', function (data) {
            console.log('saveRecording', data);

            var jsdata = {
                musicFile: currentMusicFile, events: recording
            };

            var json = JSON.stringify(jsdata);
            //console.log('data to save: ', json);

            fs.writeFile(apppath + 'recordings/' + data.file, json, (err) => {
                console.log('save complete');

                if (err)
                    console.log('error: ', err);
            });

        });


        socket.on('shutdown', function () {

            spawn('shutdown', ['-h','now']);

        });

    });

    //startPlayback('full song');


    export function lightOn(lightNum) {

        if (lightNum == 0)
            shiftRegister.all(m=> m.on());
        else
            shiftRegister.pin(lightNum - 1).on();

    }


    export function lightOff(lightNum) {

        if (lightNum == 0)
            shiftRegister.all(m=> m.off());
        else
            shiftRegister.pin(lightNum - 1).off();

    }

    export function flickerStart(lightNum) {

        if (lightNum == 0)
            shiftRegister.all(m=> m.on());
        else
            shiftRegister.pin(lightNum - 1).flickerStart();


    }

    function playMusic(file: string) {

        if (musicChild)
            musicChild.kill();


        musicChild = spawn('mpg321', [apppath + 'music/' + file]);

    }

    function stopMusic() {

        if (musicChild)
            musicChild.kill();

        musicChild = null;
    }




    function startPlayback(filename) {


        fs.readFile(apppath + 'recordings/' + filename, {}, (err, jsondata) => {

            var recordedFile = <Recording>JSON.parse(jsondata);
            currentMusicFile = recordedFile.musicFile;

            recording = recordedFile.events;
            playMusic(currentMusicFile);

            replayRecording(0);
        });



    }

    var playbackTimer: number;

    //var recordingCounter;
    var playbackStartTime;

    export function replayRecording(eventCtr: number) {
        console.log('replayRecording ' + eventCtr);

        var time = new Date().getTime();

        if (eventCtr == 0)
            playbackStartTime = time;


        if (eventCtr == recording.length)
            return;


        var event = recording[eventCtr];



        var wait = Math.max(0, playbackStartTime - time + event.ms);

        console.log('next action: ' + event.action + ' light: ' + event.num + ' starting in ' + wait);

        playbackTimer = setTimeout(() => {
            replayRecording(eventCtr + 1);

            console.log('replaying action: ' + event.action);
            pumpkinlights[event.action](event.num);
        }, wait);

    }

    interface RecordedEvent {
        action: string;
        num: number;
        ms: number;

    }



    interface Recording {

        musicFile: string;
        events: RecordedEvent[];

    }

}