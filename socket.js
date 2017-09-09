'use strict';

var config = require('./config/general');
var irc = require('irc');

module.exports = function(io) {
    io.origins('*:*');
    io.on('connection', function(socket) {
        console.log('Client connected');
        var irc_client = false;
        var irc_details;

        socket.on('ircDetails', function(data) {
            irc_details = data;
            irc_client = new irc.Client(irc_details.server, config.mobile_username_prefix + irc_details.username, {
                userName: config.mobile_username_prefix + irc_details.username,
                channels: [irc_details.channel],
                port: irc_details.port,
                password: irc_details.password,
                realName: config.real_name,
                secure: irc_details.ssl,
                selfSigned: true,
                showErrors: true
            });

            irc_client.addListener('raw', function(message) {
                socket.emit('raw', message);
            });

            irc_client.addListener('error', function(error) {
                socket.emit('irc_error');
                irc_client.disconnect('', function() {
                    console.log('Disconnected IRC client because of an error');
                });
                socket.disconnect();
            });
        });

        socket.on('channel', function(data) {
            irc_client.say(irc_details.channel, data.text);
        });

        socket.on('private', function(data) {
            irc_client.say(data.user, data.text);
        });

        socket.on('disconnect', function() {
            console.log('Websocket client disconnected');
            irc_client.disconnect('', function() {
                console.log('Disconnected IRC client');
            });
        });
    });
};
