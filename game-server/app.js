var pomelo = require('pomelo');

var routeUtil = require('./app/util/routeUtil');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'locust');

app.configure('production|development', 'connector', function(){
    app.set('connectorConfig',
        {   
            connector : pomelo.connectors.hybridconnector,
            heartbeat : 3,
        }); 
});

app.configure('production|development', 'gate', function(){
    app.set('connectorConfig',
        {   
            connector : pomelo.connectors.hybridconnector,
            useProtobuf : true
        }); 
});

app.configure('production|development', 'game', function(){
    app.set('connectorConfig',
        {
            connector : pomelo.connectors.hybridconnector,
            useProtobuf : true
        }); 
});

/*
app.configure('production|development', 'auth|chat', function(){
	app.route('chat', routeUtil.chat);
	app.route('auth', routeUtil.auth);
})*/

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
