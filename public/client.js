var socket = io.connect();
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var img = new Image();


socket.on('frame', function (data) {
  img.onload = function () {
    context.drawImage(this, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'data:image/png;base64,' + data.buffer;
//*
  setTimeout(function(){
    socket.emit('req');
  },100);
//*/
  socket.on('disconnect', function(socket) {

  });


});
