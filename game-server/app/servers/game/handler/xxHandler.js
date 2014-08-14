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
	var teamId = teamManager.getOptimalRoomId(session.uid, session.get('username'), session.get('serverId'));

	if (teamId !== 0){
		var res = teamManager.getTeammateServerIds(session.uid, teamId);
		if (res != null){
			messageService.pushMessageByUids(res, 'onXXAddPlayer', teamManager.getPlayerBasicInfo(session.uid, teamId));
			next(null, {code: 200, teamManager.getTeammateBasicInfo(session.uid, teamId)});
			return ;
		}
	} 

	next({code: 201});
	return ;
}

//开始游戏
handler.xxStartGame = function(msg, session, next){
	var res = teamManager.isStartGame(msg.teamId);
	if (res === true){
		var res = teamManager.getTeammateServerIds(session.uid, msg.teamId);
		var playerNumber = teamManager.getPlayerServerIds(msg.teamId);
		messageService.pushMessageByUids(res, 'onXXStartGame', {number: parseInt(playerNumber.length)});
		next(null, {code: 200})
	} else {
		next(null, {code: 202});
	}
}

//看牌
handler.xxCheckHandCard = function(msg, session, next){
	var res = teamManager.getPlayerHandCard(session.uid, msg.teamId);
	if (res != null){
		var teammaters = teamManager.getTeammateServerIds(session.uid, msg.teamId);
		messageService.pushMessageByUids(teammaters, 'onXXCheckHandCard', {userId: session.uid});
		next (null, {code: 200, handCard: res});
		return ;
	} 

	next (null, {code: 201});
}

//押注
handler.xxUpdatePlayerBet = function(msg, session, next){
	if (parseInt(msg.amount) <= 0){
		next (null, {code: 201});
		return ;
	}

	var res = teamManager.updatePlayerBet(session.uid, msg.amount, msg.teamId);
	if (res !== null) {
		var teammaters = teamManager.getTeammateServerIds(session.uid, msg.teamId);
		messageService.pushMessageByUids(teammaters, 'onXXUpdatePlayerBet', {userId: session.uid, amount: msg.amount, type: msg.type, nextUserId: 100});
		next(null, {code: 200});
		return ;
	}

	return next();
}

//放弃
handler.xxDiscard = function(msg, session, next){
	var res = teamManager.playerDiscard(session.uid, msg.teamId);
	if (res !== null) {
		var teammaters = teamManager.getTeammateServerIds(session.uid, msg.teamId);
		messageService.pushMessageByUids(teammaters, 'onXXPlayerDiscard', {userId: session.uid});
		next (null, {code: 200});
		return ;
	}
	return next(null, {code: 201});
}

//比较
handler.xxCompare = function(msg, session, next){
	var res = teamManager.getCompareHandCard(session.uid, msg.other, msg.teamId);
	if (res != null){
		var active = teamManager.getActiveNumber(msg.teamId);
		if (active === 1) {
			var winer = res ? session.uid : msg.other;
			doSettlementGame(winer, msg.teamId, next);
		} else {
			var teammaters = teamManager.getTeammateServerIds(session.uid, msg.teamId);
			messageService.pushMessageByUids(teammaters, 'onXXCompareHandCard', {userId: res ? session.uid : msg.other, status: res ? 0 : 1});
			next(null, {code: 200, status: res ? 0 :1});
			return ;
		}
	}
	return next(null, {code: 201});
	
}

//孤注一掷
handler.xxAllIn = function(msg, session, next){
	var players = teamManager.getActiveUserId(session.uid, msg.teamId);
	if (players && players.length === 1) {
		var res = teamManager.getCompareHandCard(session.uid, players[0], msg.teamId);
		if (res != null) {
			var winer = res ? session.uid : players[0];
			doSettlementGame(winer, msg.teamId, next);
		}
	} else if (players && players.length > 1){
		for (var i=0; i<players.length; ++i) {
			var res = teamManager.getCompareHandCard(session.uid, players[i], msg.teamId);
			if (res != null && res === false) {
				var teammaters = teamManager.getTeammateServerIds(session.uid, msg.teamId);
				messageService.pushMessageByUids(teammaters, 'onXXCompareHandCard', {userId: session.uid, status: 0});
				next(null, {code: 200, status: 0});
				return ;
			} else if (res === null) {  
				next (null, {code: 201});
				return ;
			}
		}

		var teammaters = teamManager.getTeammateServerIds(session.uid, msg.teamId);
		messageService.pushMessageByUids(teammaters, 'onXXCompareHandCard', {userId: session.uid, status: 1});
		next(null, {code: 200, status: 1});
		return ;
	}
}

//离开游戏
Handler.xxPlayerLeave = function(msg, session, next){
	var res = teamManager.playerLeave(session.uid, msg.teamId);
	if (res != null) {
		var teammaters = teamManager.getTeammateServerIds(session.uid, msg.teamId);
		messageService.pushMessageByUids(teammaters, 'onXXPlayerLeave', {userId: session.uid});
		next (null, {code: 200});
		return ;
	}
	return next(null, {code: 201});
}

//结算
var doSettlementGame = function(userId, teamId, next){
	var players = teamManager.getPlayerServerIds(teamId);
	var fund = teamManager.getAllFund(teamId);
	var bet = teamManager.getPlayerBet(teamId);
	messageService.pushMessageByUids(players, 'onXXSettlement', {winer: userId, fund: fund, bet: bet});
	
}
