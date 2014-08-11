var async = require('async');

var logic = require('../logic/xxLogic');
var poker = require('../statistic/poker');
var protocol = require('../statistic/xxProtocolData');

var userAccount = require('../../dao/userAccount');
var userDao = require('../../dao/userDao')

module.exports = Handler;

var MAX_MEMBER_NUM = 5;

/*
*playerCard: {hand: 手牌, patterns: 牌型, status: 状态}
*/
function Handler(teamId){
	this.teamId = teamId;
	this.allFund = 0;
	this.playerMap = {};
	this.playerNum = 0;
	this.startTime = Date.now()+15000;
	this.deckCards = poker.getXXPoker();
};

/*
*function: 初始化数据
*params: 
**/
Handler.prototype.initGame = function(args) {
	//this.teamId = args.teamId;
	//this.deck = deck.getXXPoker();
}

/*
*function: 添加用户
*params: 
**/
Handler.prototype.addPlayer = function(userId, serverId){
	if (!this.isTeamHasPosition()) {
		return 3;
	}
	if (this.isPlayerInTeam(userId)) {
		return 4;
	}

	if (this.playerNum < MAX_MEMBER_NUM){
		this.playerNum++;
	}

	doAddPlayer(this, userId, serverId);
	return 0;
}

/*
*function: 删除用户
*params: 
**/
Handler.prototype.removePlayer = function(args){
	var player = this.playerMap[args.uid];

	if (player){
		delete this.playerMap[args.uid];
	}
}

/*
*function: 更新卡牌状态
*params: 
**/
Handler.prototype.updateHandCard = function(args){
	var player = this.playerMap[args.uid];
	if (player){
		player.handStatus = args.handStatus;
	}
}

/*
*function: 更新金币
*params: 
**/
Handler.prototype.updateBet = function(args){
	var player = this.playerMap[args.uid];
	if (player){
		if (player.balance >= args.balance){
			player.balance -= args.balance;
			this.allFund += args.balance;
			return true;
		}
		else {
			return false;
		}
	}

	return false;
}

/*
*function: 更新玩家帐户
*params: 
**/
Handler.prototype.updateAccount = function(args){
	var player = this.playerMap[args.uid];
	if (player){
		player.balance += args.goldCoin;
	}
}

Handler.prototype.isTeamHasPosition = function() {
	return this.getPlayerNum() < MAX_MEMBER_NUM;
}

Handler.prototype.getPlayerNum = function() {
	return this.playerNum;
}

Handler.prototype.isTeamHasMember = function() {
	return this.getPlayerNum() > 0;
}

Handler.prototype.isPlayerInTeam = function(playerId) {
	var player = this.playerMap[playerId];
	return player ? true : false;
}

Handler.prototype.getTeammateServerIds = function(userId){
	var serverIds = [];
	for (var player in this.playerMap){
		if (playerMap[player].userId != userId){
			serverIds.push({uid: playerMap[player].userId, sid: playerMap[player].serverId});
		}		
	}
	return serverIds;
}

Handler.prototype.getPlayerBasicInfo = function(userId){
	for (var player in this.playerMap){
		if (player === userId){
			var param = {
				userId: playerMap[player].userId,
				username: playerMap[player].username,
				avatar: playerMap[player].avatar,
				balance: playerMap[player].balance
			}

			return param;
		}
	}
}

Handler.prototype.getTeammateBasicInfo = function(userId){
	var teammates = [];

	for (var player in this.playerMap){
		if (player !== userId){
			var param = {
				userId: playerMap[player].userId,
				username: playerMap[player].username,
				avatar: playerMap[player].avatar,
				balance: playerMap[player].balance
			}
			teammates.push(param);
		}
	}
	return teammates;
}


function doAddPlayer(teamObj, userId, serverId) {
	var player = new protocol.Player(userId);
	player.handCard = handCard.cards;
	player.handPattern = handCard.pattern;

	teamObj.playerMap[userId] = player;

	async.parallel([
		function(callback){
			userDao.queryPlayer(userId, callback);
		},
		function(callback){
			userAccount.queryAccount(userId, callback);
		}
	], function(error, res){
		if (error === null && res[0] != undefined){
			if (res[0].username && res[0].avatar){
				var User = new protocol.User();
				var handCard = logic.creatHandCard(teamObj.deckCards);

				User.userNo = teamObj.getPlayerNum()+1;
				User.userId = userId|0;
				User.username = res[0].username|'';
				User.avatar = res[0].avatar|'';
				User.balance = res[0].balance|0;
				User.serverId = serverId;

				User.handCard = handCard.cards|[];
				User.handPattern = handCard.pattern;
				User.handStatus = 0;

				teamObj.playerMap[userId] = User;

			}
		}
		
		return 0;
	})
}





