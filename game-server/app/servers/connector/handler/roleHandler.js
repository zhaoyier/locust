var userDao = require('../../../dao/userDao');

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
    this.amount = 0;
};

Handler.prototype.createPlayer = function(msg, session, next){
	userDao.getPlayerInfo(msg.from, function(error, player){
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

Handler.prototype.getPlayerBasic = function(msg, session, next){
	userDao.getPlayerInfo(msg.from, function(error, player){
		if (player){
			next(null, {code: 200, avatar: player.avatar});
			return ;
		} else {
			next(null, {code: 201});
			return ;
		}
	})
}

//更新玩家基本信息
Handler.prototype.updatePlayerBasic = function(msg, session, next){

}

//
Handler.prototype.queryMessageInfo = function(msg, session, next){

}

Handler.prototype.queryAwardInfo = function(msg, session, next){

}


Handler.prototype.queryRankInfo = function(msg, session, next){

}

Handler.prototype.queryActivityInfo = function(msg, session, next){

}

Handler.prototype.queryShopInfo = function(msg, session, next){

}

Handler.prototype.buyProps = function(msg, session, next){

}

