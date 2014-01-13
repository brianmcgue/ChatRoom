// export *;
//
// function route (request, response) {
//   if (request.url === '/') {
//     response.send()
//   } else {
//     fs.readFile(request.param('url'), function (err, data) {
//       if (err) {
//         response.status(404);
//         throw err;
//       }
//       response.write(data);
//       response.end();
//     });
//   }
// }