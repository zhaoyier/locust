var chatRemote = require('../remote/chatRemote');

module.exports = function(app){
	return new Handler(app);
}

var Handler = function(app){
	this.app = app;
}

var handler = Handler.prototype;

/**
* Send messages to users
*
* @param {Object} msg message from client
* @param {Object} session
* @param  {Function} next next stemp callback
*
*/
handler.chatAsRoomId = function(msg, session, next){
	//var uids = 
}

handler.chatAs