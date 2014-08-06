var userDao = require('../../../dao/userDao');

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

Handler.prototype.createPlayer = function(msg, session, next){
	
	userDao.getPlayer(id, function(error, player){
		if (player){
			next(null, {code: 201});
			return ;
		}

		userDao.createPlayer(msg.from, function(error, player){
			next(null, {code: 200, avatar: player.avatar});
			return 0;
		})
	})
}

Handler.prototype.getPlayer = function(msg, session, next){
	userDao.getPlayerInfo(id, function(error, player){
		if (player){
			next(null, {code: 200, avatar: player.avatar});
			return ;
		} else {
			next(null, {code: 201});
			return ;
		}
	})
}

Handler.prototype.updatePlayer = function(msg, session, next){

}

Handler.prototype.queryMessage = function(msg, session, next){

}

Handler.prototype.queryAward = function(msg, session, next){

}

Handler.prototype.getAward = function(msg, session, next){

}

Handler.prototype.queryRank = function(msg, session, next){

}

Handler.prototype.queryActivity = function(msg, session, next){

}

Handler.prototype.queryShop = function(msg, session, next){

}

Handler.prototype.consumeShop = function(msg, session, next){

}

