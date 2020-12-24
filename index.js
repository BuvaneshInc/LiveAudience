var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;

app.get('/', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('Socket.IO Connected Successfully');
});

io.sockets.on("connection", function (socket) {

  socket.on("livedashboard", function (user) {
    try {
      var obj = JSON.parse(user);
      socket.join(obj.domainName);
      socket.join('LiveAudienceUsers');
    } catch (e) {
      consolelog(e);
    }
  });

  socket.on("NewWebUser", function (user) {
    try {
      var obj = JSON.parse(user);
      obj.socketId = socket.id;
      socket.to(obj.domainName).emit(obj.domainName, obj);
    } catch (e) {
      consolelog(e);
    }
  });
  socket.on("NewMobileUser", function (user) {
    try {
      var obj = JSON.parse(user);
      obj.socketId = socket.id;
      socket.to(obj.appId).emit(obj.appId, obj);
    } catch (e) {
      consolelog(e);
    }
  });


  socket.on('disconnect', function () {
    try {
      socket.to('LiveAudienceUsers').emit('UserDisconnected', socket.id);
    } catch (e) {
      consolelog(e);
    }
  });

});


http.listen(port, function () {
  console.log('listening on *:' + port);
});

function consolelog(message) {
  console.log(getDateTime() + ": " + message);
}

function getDateTime() {
  var currentdate = new Date();
  var datetime = currentdate.getDate() + "/" +
    (currentdate.getMonth() + 1) + "/" +
    currentdate.getFullYear() + " @ " +
    currentdate.getHours() + ":" +
    currentdate.getMinutes() + ":" +
    currentdate.getSeconds();

  return datetime;
}