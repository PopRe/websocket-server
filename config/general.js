'use strict';

module.exports = {
    // Server environement
    env: process.env.NODE_ENV,

    // Server port
    server_port: process.env.PORT || 9000,

    // Prefix for usernames connecting through a mobile client
    mobile_username_prefix: 'y000',

    // Real name (IRC term) used for authentication when sending messages
    real_name: 'POPMM Mobile Client 1.0'
};
