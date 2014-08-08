var teamManager = require('../../../services/xxManager');
var messageService = require('../../../domain/messageService');

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

var handler = Handler.prototype;

handler.xxEnterGame = function(msg, session, next){
	//next(null, {code: 200, number:2});
	var result = teamManager.getOptimalRoomId({userId: 100, username: 'test'});
	if (result.code == 0){
		//notice other user
		var serverIds = result.teamObj.getTeamPlayerServerId();
		messageService.pushMessageByUids(serverIds, "onXXEnterTeam", {username: "test"});
		next()
	}
	else {
		//error 
		next({code: 201});
		return ;
	}
}

//发牌
handler.xxDeal = function(msg, session, next){

}

//看牌
handler.xxCheck = function(msg, session, next){

}

//押注
handler.xxBet = function(msg, session, next){

}

//跟注
handler.xxCall = function(msg, session, next){

}

//加注
handler.xxRise = function(msg, session, next){

}

//放弃
handler.xxDiscard = function(msg, session, next){

}

//比较
handler.xxCompare = function(msg, session, next){

}

//孤注一掷
handler.xxAllIn = function(msg, session, next){

}

//结算
var doSettlementGame = function(msg, session, next){

}

var pushMessageToPlayer = function(uid, route, msg){

}

var pushMessageByUids = function(uids, route, msg){
	
}
