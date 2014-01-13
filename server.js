var http = require('http');
var fs = require('fs');
var nodeStatic = require('node-static');
var chatServer = require('./lib/chat_server');
// var path = require('path');
// var mime = require('mime');

var staticServer = new nodeStatic.Server('./public');

var server = http.createServer(function (request, response) {
  staticServer.serve(request, response);
}).listen(8080);

chatServer.createChat(server);

console.log('Server running at http://127.0.0.1:8080/');