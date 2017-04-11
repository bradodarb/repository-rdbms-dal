'use strict';

const Hapi = require('hapi');
const config = require('./config');

// Create a new server
const server = new Hapi.Server();

// Setup the server with a host and port
server.connection({
  port: config.application.port
});

server.register([
  {
    register: require('./'),
    options: config
  }], (err) => {
  if (err) {
    console.error('Failed loading application plugins', err);
    process.exit(1);
  } else {
    process.exit(0);
  }
});

module.exports = server;
