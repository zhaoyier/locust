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
  var self = this;
  var sessionService = self.app.get('sessionService');

  userDao.loginAccount(msg.username, msg.password, function(error, res){
    if (!error){
      if (!!sessionService.getByUid(res.userId)){
        next(null, {code: 201, error: true});
      }

      session.bind(res.userId);
      session.set('username', msg.username);
      session.set('serverId', self.app.get('serverId'));
      session.on('closed', onUserLeave.bind(null, self.app));

      var ip = session.__session__.__socket__.remoteAddress.ip;
      console.log("**********entry***********:\t", ip);
      self.app.rpc.auth.authRemote.entryGame(session, res.userId, self.app.get('serverId'), ip, function(error){
        next(null, {code: 200, userId: res.userId});
      });      
    }
    else {
      next(null, {code: 201})
    }
  })
};

Handler.prototype.register = function(msg, session, next){
  if (msg.password !== msg.repassword){
    next(null, {code: 201});
    return ;
  }

  userDao.registerAccount(msg.username, msg.password, function(error, res){
    if (!error){
      session.bind(msg.username);
      session.on('closed', onUserLeave.bind(null, self.app));

      var ip = session.__session__.__socket__.remoteAddress.ip;
      self.app.rpc.auth.authRemote.entryGame(session, res.id, self.app.get('serverId'), ip);

      next(null, {code: 200, id: res.id});
    } else {
      next(null, {code: 201});
    }
  }) 
}

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
    //app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
    app.rpc.auth.authRemote.kick(session, session.uid, app.get('serverId'), session.get('username'));
};
