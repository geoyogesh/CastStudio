//serve a local file
var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var player = require('chromecast-player')();
var os = require('os');
var open = require('open');


// configure app to use bodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var server_name = os.hostname();

//api implimentation
var router = express.Router();

//selected_filepath
var media_path = null;

var mimeTypes = {
	".swf": "application/x-shockwave-flash",
	".flv": "video/x-flv",
	".f4v": "video/mp4",
	".f4p": "video/mp4",
	".mp4": "video/mp4",
	".asf": "video/x-ms-asf",
	".asr": "video/x-ms-asf",
	".asx": "video/x-ms-asf",
	".avi": "video/x-msvideo",
	".mpa": "video/mpeg",
	".mpe": "video/mpeg",
	".mpeg": "video/mpeg",
	".mpg": "video/mpeg",
	".mpv2": "video/mpeg",
	".mov": "video/quicktime",
	".movie": "video/x-sgi-movie",
	".mp2": "video/mpeg",
	".qt": "video/quicktime",
	".mp3": "audio/mpeg",
	".wav": "audio/x-wav",
	".aif": "audio/x-aiff",
	".aifc": "audio/x-aiff",
	".aiff": "audio/x-aiff",
	".jpe": "image/jpeg",
	".jpeg": "image/jpeg",
	".jpg": "image/jpeg",
	".png" : "image/png",
	".svg": "image/svg+xml",
	".tif": "image/tiff",
	".tiff": "image/tiff",
	".gif": "image/gif",
	".txt": "text/plain",
	".xml": "text/xml",
	".css": "text/css",
	".htm": "text/html",
	".html": "text/html",
	".pdf": "application/pdf",
	".doc": "application/msword",
	".vcf": "text/x-vcard",
	".vrml": "x-world/x-vrml",
	".zip": "application/zip",
	".webm": "video/webm",
	".m3u8": "application/x-mpegurl",
	".ts": "video/mp2t",
	".ogg": "video/ogg"
};

// accessed at GET http://localhost:3000/api/listfiles)
router.post('/cast', function (req, res) {

    media_path = req.body.path
    var player = require('chromecast-player')();
    var media = 'http://'+server_name+':'+ port +'/api/media/1.mp4';
    player.launch(media, function (err, p) {
        p.once('playing', function () {
            console.log('playback has started.');
            res.json({status: 'playing'});
        });
    });
});

//endpoint to serve the local media : https://gist.github.com/paolorossi/1993068
router.get('/media/:filename', function (req, res) {
    console.log(media_path);
    var path = media_path;
    var mine = null;
    var file_path = decodeURIComponent(path);
    var ext = file_path.match(/.*(\..+?)$/);

		if (ext === null || ext.length !== 2 || (mine = mimeTypes[ext[1].toLowerCase()]) === undefined) {
			res.json({error: 'badMime'});
		}
    
    var stat = fs.statSync(path);
    var total = stat.size;
    if (req.headers['range']) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total-1;
        var chunksize = (end-start)+1;
        console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

        var file = fs.createReadStream(path, {start: start, end: end});
        res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': mine });
        file.pipe(res);
    } else {
        console.log('all: ' + total);
        res.writeHead(200, { 'Content-Length': total, 'Content-Type': mine });
        fs.createReadStream(path).pipe(res);
    }
});

// accessed at GET http://localhost:3000/api/listfiles)
router.post('/listfiles', function (req, res) {
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
        path: isfolder===true?current_path:folder_path,
        exist: exist,
        folder: folder,
        isfolder: isfolder,
        files: files,
        file_location: isfolder===true?null:current_path
    });
});


//register routes
app.use(express.static('app'));
app.use('/api', router);




var port = process.env.PORT || 3000; // set our port
var url = 'http://'+server_name+':'+ port +'/';
http.listen(port, function () {
    console.log('listening on *:3000');
    open(url);
});

