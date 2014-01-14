(function (root) {
  var ChatApp = root.ChatApp = (root.ChatApp || {});

  var Chat = ChatApp.Chat = function (socket, ui) {
    var that = this;
    this.socket = socket;
    this.ui = ui;

    this.socket.on('message', function (data) {
      that.ui.displayMessage(data);
    });

    this.socket.on('nicknameChangeResult', function (data) {
      that.ui.displaySystemMessage({
        text: data.message
      });
    });

    this.socket.on('system', function (data) {
      that.ui.displaySystemMessage(data);
    });
  };

  Chat.prototype.sendMessage = function (text) {
    if (text.slice(0, 1) === '/') {
      this.processCommand(text);
    } else {
      this.socket.emit('message', text);
    }
  };

  Chat.prototype.processCommand = function (text) {
    if (text.slice(0, 6) === '/nick ') {
      this.socket.emit('nicknameChangeRequest', text.slice(6));
    } else {
      this.ui.displaySystemMessage({
        text: 'Command not recognized.'
      });
    }
  }
})(this);