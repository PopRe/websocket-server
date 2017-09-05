'use strict';

var bodyParser = require('body-parser');
var cors = require('cors');
var useragent = require('express-useragent');

module.exports = function(app) {

    /* env can be used to set specific dev-settings ex. livereload */
    var env = app.get('env');

    // Access user agent string
    app.use(useragent.express());

    // Enable CORS
    app.use(cors());

    // Disable Powered By header from Express
    app.disable('x-powered-by');

    // Tell Express we're behind a proxy (Nginx in prod)
    app.enable('trust proxy');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
};
