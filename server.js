const express = require('express');
const server = express();

server.all('/', (req, res) => res.send('ok'));


function keepAlive() {
  server.listen(3000, () => console.log('server is alive'));
}

module.exports = keepAlive;