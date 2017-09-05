/**
 * Main application file
 */
'use strict';

var config = require('./config/general');

var path = require('path');
global.appRoot = path.resolve(__dirname);

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    transports: ['websocket', 'xhr-polling']
});

// Setup express
require('./config/express')(app);

// Setup socket.io
require('./socket')(io);

// Respond on a GET request
app.get('/', function(request, response) {
    response.send('Nothing to see here')
});

// Start server
if(!module.parent) {
    http.listen(config.server_port, function() {
        console.log('Express server listening on %d, in %s mode', config.server_port, app.get('env'));
    });
}

module.exports = app;
