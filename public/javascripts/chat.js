(function (root) {
  var ChatApp = root.ChatApp = (root.ChatApp || {});

  var Chat = ChatApp.Chat = function (socket, ui) {
    var that = this;
    this.socket = socket;
    this.ui = ui;

    this.socket.on('message', function (data) {
      that.ui.displayMessage(data);
    });
  };

  Chat.prototype.sendMessage = function (text) {
    this.socket.emit('message', text);
  };
})(this);