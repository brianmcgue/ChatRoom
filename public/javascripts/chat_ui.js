(function (root) {
  var ChatApp = root.ChatApp = (root.ChatApp || {});

  var ChatUI = ChatApp.ChatUI = function () {
    this.socket = io.connect();
    this.chat = new ChatApp.Chat(this.socket, this);
  };

  ChatUI.prototype.getMessage = function () {
    return $('#message_text').val();
  }

  ChatUI.prototype.sendMessage = function (text) {
    this.chat.sendMessage(text);
  }

  ChatUI.prototype.displayMessage = function (data) {
    var $newMessage = $('<div>');
    var text = data.text;

    $newMessage.text(text);
    $('#messages').append($newMessage);
  }
})(this);

$(function () {
  var chat = new ChatApp.ChatUI();

  $('form').on('submit', function (event) {
    event.preventDefault();
    var msg = chat.getMessage();
    chat.sendMessage(msg);
    $('#message_text').val("");
  });
});