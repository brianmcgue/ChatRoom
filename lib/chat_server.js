var socketIO = require('socket.io');

function createChat (server) {
  var socketServer = socketIO.listen(server);

  var guestNumber = 0;
  var nicknames = {};
  var namesUsed = [];

  socketServer.sockets.on('connection', function (socket) {
    guestNumber += 1;
    nicknames[socket.id] = 'guest' + guestNumber;

    socket.on('message', function (text) {
      var data = {};
      data['text'] = text;
      data['user'] = nicknames[socket.id];

      socketServer.sockets.emit('message', data);
    });

    socket.on('nicknameChangeRequest', function (nickname) {
      processNicknameChange(nickname, socket);
    });

    socket.on('disconnect', function () {
      var user = nicknames[socket.id];
      delete namesUsed[namesUsed.indexOf(user)];
      socketServer.sockets.emit('system', {
        text: user + ' has left the chat room.'
      });
      delete user; //maybe change to nicknames[socket.id];
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
        message: 'Nickname was successfully changed to ' + nickname + '.'
      });
    }
  }
}

exports.createChat = createChat;