var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var cv = require('opencv');
var process = require('process');

http.listen(3000, function() {
  console.log('Server is running on port 3000');
});

app.use(express.static('public'));

app.get('/stream', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var io = require('socket.io').listen(http);
var camera = new cv.VideoCapture('rtsp://admin:admin@140.113.179.14:8088/channel1');
var camInterval = 100;
var c2i='';
cam2img();
function cam2img() {
  camera.read(function(err, im) {
    if (err) throw err;
      c2i=im;
      cam2img();
    });
}
var clientid=[];
var clientb64=[];
io.sockets.on('connection',function(socket){
  clientid.push(socket.id);
  clientb64.push('');
  console.log(clientid);
/*
    setInterval(function(){
      c2i.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
        if (err) throw err;
        for (var i = 0; i < faces.length; i++) {
          if (err) throw err;
          face = faces[i];
          c2i.rectangle([face.x, face.y], [face.width, face.height], [0, 255, 0], 2, function(err){
            if (err) throw err;
          });
        }
        clientb64[clientid.indexOf(socket.id)]=c2i.toBuffer(".jpg", function(err){
        }).toString("base64");
        socket.emit('frame', { buffer:  clientb64[clientid.indexOf(socket.id)]});
      });
    },100);
//*/
  //console.log(clientb64);
//*
  socket.emit('frame', { buffer:  clientb64[clientid.indexOf(socket.id)]});
  socket.on('req', function() {
    c2i.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
      if (err) throw err;
      for (var i = 0; i < faces.length; i++) {
        if (err) throw err;
        face = faces[i];
        c2i.rectangle([face.x, face.y], [face.width, face.height], [0, 255, 0], 2, function(err){
          if (err) throw err;
        });
      }
      clientb64[clientid.indexOf(socket.id)]=c2i.toBuffer(".jpg", function(err){
      }).toString("base64");
      socket.emit('frame', { buffer:  clientb64[clientid.indexOf(socket.id)]});
    });

  });
//*/
  socket.on('disconnect', function(socket) {
    clientid.splice(clientid.indexOf(socket.id), 1);
    clientb64.splice(clientid.indexOf(socket.id), 1);
    console.log(clientid);
    //console.log(clientb64);
  });
});
