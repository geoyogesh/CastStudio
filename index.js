//serve a local file
var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var player = require('chromecast-player')();

// configure app to use bodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



//api implimentation
var router = express.Router();

//selected_filepath
var media_path = null;

// accessed at GET http://localhost:3000/api/listfiles)
router.post('/cast', function (req, res) {

    media_path = req.body.path
    var player = require('chromecast-player')();
    var media = 'http://192.168.1.4:3000/api/media/1.mp4';
    player.launch(media, function (err, p) {
        p.once('playing', function () {
            console.log('playback has started.');
            res.json({status: 'playing'});
        });
    });
});

//endpoint to serve the local media
router.get('/media/:filename', function (req, res) {
    console.log(media_path);
    res.sendfile(media_path);
});

// accessed at GET http://localhost:3000/api//listfiles)
router.post('/listfiles', function (req, res) {
    console.log(req.connection.remoteAddress);
    var homedir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
    var folder_path = req.body.path || homedir;
    var folder = req.body.folder || '';
    current_path = path.join(folder_path, folder);
    var exist = fs.existsSync(current_path);
    var isfolder = null;
    var files = [];
    if (exist) {
        isfolder = fs.lstatSync(current_path).isDirectory();
        if (isfolder) {
            files = fs.readdirSync(current_path);
        }
    } 

    res.json({
        path: folder_path,
        exist: exist,
        folder: folder,
        isfolder: isfolder,
        files: files,
        file_location: current_path
    });
});


//register routes
app.use(express.static('app'));
app.use('/api', router);




var port = process.env.PORT || 3000; // set our port

http.listen(port, function () {
    console.log('listening on *:3000');
});