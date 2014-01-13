var socketIO = require('socket.io');

function createChat (server) {
  var socketServer = socketIO.listen(server);

  socketServer.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });

    socket.on('message', function (data) {
      socketServer.sockets.emit('message', data);
    });
  });
}

exports.createChat = createChat;