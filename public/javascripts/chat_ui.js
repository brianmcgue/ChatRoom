(function (root) {
  var ChatApp = root.ChatApp = (root.ChatApp || {});

  var ChatUI = ChatApp.ChatUI = function () {
    this.socket = io.connect();
    this.chat = new ChatApp.Chat(this.socket, this);
  };

  ChatUI.prototype.getMessage = function () {
    return $('#message_text').val();
  };

  ChatUI.prototype.sendMessage = function (text) {
    this.chat.sendMessage(text);
  };

  ChatUI.prototype.displayMessage = function (data) {
    var $newMessage = $('<div>');
    var text = data.text;
    var user = data.user;

    $newMessage.text(user + ": " + text);
    $('#messages').prepend($newMessage);
  };

  ChatUI.prototype.displaySystemMessage = function (data) {
    var $message = $('<div>');
    $message.addClass('system');
    $message.text(data.text);

    $('#messages').prepend($message);
    this.showCurrentUsers(data.users);
  };

  ChatUI.prototype.showCurrentUsers = function (users) {
    users.forEach(function (user) {
      var $user = $('<li>');
      $user.text(user);

      $('#users').append($user);
    });
  };
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