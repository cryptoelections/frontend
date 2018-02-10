const server = require('server');
const { get, post } = server.router;

server([
  get('/', ctx => 'Hello world!')
]);
