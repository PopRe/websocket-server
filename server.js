/**
 * Main application file
 */
'use strict';


var config = require('./config/general');

var path = require('path');
global.appRoot = path.resolve(__dirname);

var fs = require('fs');
var net = require('net');
var http = require('http');
var https = require('https');

var baseAddress = config.server_port;
var redirectAddress = 9001;
var httpsAddress = 9002;
var httpsOptions = {
    key: fs.readFileSync('./encryption/ts.popre.net-key.pem'),
    cert: fs.readFileSync('./encryption/ts.popre.net-crt.pem')
};

var app = require('express')();

var httpsServer = https.createServer(httpsOptions,app);


var io = require('socket.io').listen(httpsServer,{secure: true});

 
io.set('transports', [                     // enable all transports (optional if you want flashsocket)
    'websocket',
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

// Setup express
require('./config/express')(app);

// Setup socket.io
require('./socket')(io);

// Respond on a GET request
app.get('/', function(request, response) {
    response.send('Nothing to see here')
});

app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


function tcpConnection(conn) {
    conn.once('data', function (buf) {
        // A TLS handshake record starts with byte 22.
        var address = (buf[0] === 22) ? httpsAddress : redirectAddress;
        var proxy = net.createConnection(address, function () {
            proxy.write(buf);
            conn.pipe(proxy).pipe(conn);
        });
    });
}

function httpConnection(req, res) {
		var host = req.headers['host'];
		
		if(req.isSocket)
		{
			res.writeHead(301, { "Location": "wss://" + host + req.url });
			res.end();	 
		}
		res.writeHead(301, { "Location": "https://" + host + req.url });
		res.end();											
	}
	
// Start server
if(!module.parent) {
	net.createServer(tcpConnection).listen(baseAddress);
	http.createServer(httpConnection,app).listen(redirectAddress);
	httpsServer.listen(httpsAddress, function() {
        console.log('Express server listening on %d, in %s mode', config.server_port, app.get('env'));
    });	
}
module.exports = app;
