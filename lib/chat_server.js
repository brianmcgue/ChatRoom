var socketIO = require('socket.io');

function createChat (server) {
  var socketServer = socketIO.listen(server);

  var guestNumber = 0;
  var nicknames = {};
  var namesUsed = [];

  var currentRooms = {};

  socketServer.sockets.on('connection', function (socket) {
    guestNumber += 1;
    // joinRoom('lobby', socket);
    nicknames[socket.id] = 'guest' + guestNumber;

    socketServer.sockets.emit('system', {
      text: nicknames[socket.id] + ' has joined the lobby.',
      users: namesUsed
    });

    socket.on('message', function (text) {
      socketServer.sockets.emit('message', {
        user: nicknames[socket.id],
        text: text
      });
    });

    socket.on('nicknameChangeRequest', function (nickname) {
      processNicknameChange(nickname, socket);
    });

    socket.on('disconnect', function () {
      var user = nicknames[socket.id];
      delete namesUsed[namesUsed.indexOf(user)];
      socketServer.sockets.emit('system', {
        text: user + ' has left the chat room.',
        users: namesUsed
      });
      delete nicknames[socket.id];
    });
  });

  function processNicknameChange (nickname, socket) {
    if (nickname.toLowerCase().slice(0, 5) === 'guest') {
      socket.emit('nicknameChangeResult', {
        success: false,
        message: 'Name cannot begin with "Guest".'
      });
    } else if (namesUsed.indexOf(nickname.toLowerCase()) >= 0) {
      socket.emit('nicknameChangeResult', {
        success: false,
        message: 'Name is currently in use.'
      });
    } else {
      namesUsed.push(nickname.toLowerCase());
      socketServer.sockets.emit('system', {
        text: nicknames[socket.id] + ' is now ' + nickname + '.'
      });

      nicknames[socket.id] = nickname;
      socket.emit('nicknameChangeResult', {
        success: true,
        message: 'Nickname was successfully changed to ' + nickname + '.',
        users: namesUsed
      });
    }
  }
  //
  // function joinRoom (room, socket) {
  //   currentRooms[room].push(socket.id);
  // }
}

exports.createChat = createChat;