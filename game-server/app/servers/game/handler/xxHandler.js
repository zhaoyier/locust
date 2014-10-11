var teamManager = require('../../../services/xxManager');
var messageService = require('../../../domain/messageService');

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

var handler = Handler.prototype;

//进入游戏
handler.xxEnterGame = function(params, session, next){
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
handler.xxStartGame = function(params, session, next){
	var res = teamManager.isStartGame(params.teamId);
	if (res === true){
		var res = teamManager.getTeammateServerIds(session.uid, params.teamId);
		var playerNumber = teamManager.getPlayerServerIds(params.teamId);
		messageService.pushMessageByUids(res, 'onXXStartGame', {number: parseInt(playerNumber.length)});
		next(null, {code: 200})
	} else {
		next(null, {code: 202});
	}
}

//看牌
handler.xxCheckHandCard = function(params, session, next){
	var res = teamManager.getPlayerHandCard(session.uid, params.teamId);
	if (res != null){
		var teammaters = teamManager.getTeammateServerIds(session.uid, params.teamId);
		messageService.pushMessageByUids(teammaters, 'onXXCheckHandCard', {userId: session.uid});
		next (null, {code: 200, handCard: res});
		return ;
	} 

	next (null, {code: 201});
}

//押注
handler.xxUpdatePlayerBet = function(params, session, next){
	if (parseInt(params.amount) <= 0){
		next (null, {code: 201});
		return ;
	}

	var res = teamManager.updatePlayerBet(session.uid, params.amount, params.teamId);
	if (res !== null) {
		var teammaters = teamManager.getTeammateServerIds(session.uid, params.teamId);
		messageService.pushMessageByUids(teammaters, 'onXXUpdatePlayerBet', {userId: session.uid, amount: params.amount, type: params.type, nextUserId: 100});
		next(null, {code: 200});
		return ;
	}

	return next();
}

//放弃
handler.xxDiscard = function(params, session, next){
	var res = teamManager.playerDiscard(session.uid, params.teamId);
	if (res !== null) {
		var teammaters = teamManager.getTeammateServerIds(session.uid, params.teamId);
		messageService.pushMessageByUids(teammaters, 'onXXPlayerDiscard', {userId: session.uid});
		next (null, {code: 200});
		return ;
	}
	return next(null, {code: 201});
}

//比较
handler.xxCompare = function(params, session, next){
	var res = teamManager.getCompareHandCard(session.uid, params.other, params.teamId);
	if (res != null){
		var active = teamManager.getActiveNumber(params.teamId);
		if (active === 1) {
			var winer = res ? session.uid : params.other;
			doSettlementGame(winer, params.teamId, next);
		} else {
			var teammaters = teamManager.getTeammateServerIds(session.uid, params.teamId);
			messageService.pushMessageByUids(teammaters, 'onXXCompareHandCard', {userId: res ? session.uid : params.other, status: res ? 0 : 1});
			next(null, {code: 200, status: res ? 0 :1});
			return ;
		}
	}
	return next(null, {code: 201});
	
}

//孤注一掷
handler.xxAllIn = function(params, session, next){
	var players = teamManager.getActiveUserId(session.uid, params.teamId);
	if (players && players.length === 1) {
		var res = teamManager.getCompareHandCard(session.uid, players[0], params.teamId);
		if (res != null) {
			var winer = res ? session.uid : players[0];
			doSettlementGame(winer, params.teamId, next);
		}
	} else if (players && players.length > 1){
		for (var i=0; i<players.length; ++i) {
			var res = teamManager.getCompareHandCard(session.uid, players[i], params.teamId);
			if (res != null && res === false) {
				var teammaters = teamManager.getTeammateServerIds(session.uid, params.teamId);
				messageService.pushMessageByUids(teammaters, 'onXXCompareHandCard', {userId: session.uid, status: 0});
				next(null, {code: 200, status: 0});
				return ;
			} else if (res === null) {  
				next (null, {code: 201});
				return ;
			}
		}

		var teammaters = teamManager.getTeammateServerIds(session.uid, params.teamId);
		messageService.pushMessageByUids(teammaters, 'onXXCompareHandCard', {userId: session.uid, status: 1});
		next(null, {code: 200, status: 1});
		return ;
	}
}

//离开游戏
Handler.xxPlayerLeave = function(params, session, next){
	var res = teamManager.playerLeave(session.uid, params.teamId);
	if (res != null) {
		var teammaters = teamManager.getTeammateServerIds(session.uid, params.teamId);
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
