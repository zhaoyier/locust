var async = require('async');

var userDao = require('../../../dao/userDao');

module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * New client entry chat server.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
	console.log("^^^^^^^^^^^^^^^^^^^^^^^^^");
  //next(null, {code: 200, msg: 'game server is ok.'});
  var res = this.app.rpc.auth.authRemote.checkToke(session, msg.username, msg.token);

  if (res !== 200){
  	return next(new Error("invalid entry"));
  }

  var wuid, player, players;
  async.waterfall([
  		function(callback){
  			userDao.verifyAccount(msg.username, msg.password, callback);
  		}, function(account, callback){
  			if (!account){
  				callback(201);
  			}

  			wuid = account.wuid;
  			userDao.getPlayerInfo(account.wuid, callback);
  		}, function(res, callback){
  			players = res;
  			this.app.get('sessionService').kick(wuid, callback);
  		}, function(callback){
  			session.bind(wuid, cb);
  		}, function(callback){
  			if (!players || players.length === 0){
  				next (null, {code: 200});
  				return ;
  			}

  			player = players[0];
  			session.set('playerId', player.id);
  			session.set('playerName', player.name);
  			session.on('closed', onUserLeave.bind(null, this.app));
  			session.pushAll(callback);
  		}, function(callback){
  			this.app.rpc.chat.chatRemote.add(session, player.id, player.name, '1', callback);
  		}
  	], function(error){
  		if (error){
  			next(error, {code: 201});
  			return ;
  		}
		console.log("****************-----------:\t", error);
  		next (null, {code: 200, player: players ? players[0]: null});
  	})
};

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function(app, session) {
    if(!session || !session.uid) {
        return;
    }   
    app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};
