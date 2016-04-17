/*
var scanner = require('chromecast-scanner');
 
scanner(function(err, service) {
  console.log('chromecast %s running on: %s',
    service.name,
    service.data);
});

//chromecast XBR-55X900C.local running on: 192.168.1.6
*/


/*
var player = require('chromecast-player')();
var media = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/ED_1280.mp4';
player.launch(media, function(err, p) {
  p.once('playing', function() {
    console.log('playback has started.');
  });
});
*/

/*
//http://shapeshed.com/writing-cross-platform-node/
var fs = require('fs');
var path = require('path');
var homedir = (process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME;
fol_path = path.join(homedir, 'Desktop');
fol_path = path.join(fol_path, 'videoplayback.mp4');
if(fs.lstatSync(fol_path).isDirectory()){
    fs.readdir(fol_path, function(err, p){
        console.log(err, p);
    });
}
else{
    console.log('selected file is', fol_path); //\Users\Yogesh\Desktop\videoplayback.mp4
}
*/


//serve a local file
var app = require('express')();
var http = require('http').Server(app);


var path = require('path');
file = '\\Users\\Yogesh\\Desktop\\videoplayback.mp4';

app.get('/:id', function(req, res){
  console.log(req.params.id);
  res.sendfile(file);
  
});



http.listen(3000, function(){
  console.log('listening on *:3000');
  
  
  var player = require('chromecast-player')();
    var media = 'http://192.168.1.4:3000/1.mp4'
    player.launch(media, function(err, p) {
    p.once('playing', function() {
        console.log('playback has started.');
    });
    });
  
});
//http://192.168.1.4:3000/1.mp4

