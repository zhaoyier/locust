var async = require('async');

var logic = require('../logic/xxLogic');
var poker = require('../statistic/poker');
var protocol = require('../statistic/xxProtocolData');
var code = require('../code/xxCode');

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
	this.playerBet = {};
	this.playerNum = 0;
	this.activeNum = 0;
	this.playerPlace = [];
	this.isStartGame = false;
	this.startTime = Date.now()+15000;
	this.deckCards = poker.getXXPoker();
};

/*
*function: 初始化数据
*params: 
**/
Handler.prototype.initGame = function(args) {
	
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
		this.activeNum++;
		this.playerNum++;
	}

	//doAddPlayer(this, userId, serverId);
	
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
				var handCard = logic.creatHandCard(this.deckCards);

				User.userId = userId|0;
				User.username = res[0].username|'';
				User.avatar = res[0].avatar|'';
				User.balance = res[0].balance|0;
				User.serverId = serverId;
				User.place = getPlayerPlace(this.placeArray);
				this.playerPlace.push(User.place);

				User.handCard = handCard.cards|[];
				User.handPattern = handCard.pattern;
				User.handStatus = 0;

				this.playerMap[userId] = User;

			}
		}
	})

	return 0;
}



/*
*function: 删除用户
*params: 
**/
Handler.prototype.removePlayer = function(userId){
	var player = this.playerMap[userId];
	var index = getPlayerPlaceIndex(player.place, this.placeArray)

	if (player){
		this.activeNum -= 1;
		this.playerNum -= 1;
		this.placeArray.splice(index, 1);
		delete this.playerMap[userId];

		return true;
	}
	return null;
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

Handler.prototype.isStartGame = function(){
	return this.isStartGame;
}

Handler.prototype.getStartTime = function(){
	return this.startTime;
}

Handler.prototype.setStartGame = function(){
	this.isStartGame = true;
}

Handler.prototype.getActiveNum = function(){
	return this.activeNum;
}

Handler.prototype.getAllFund = function(){
	return this.allFund;
}

Handler.prototype.getPlayerBet = function(){
	return this.playerBet;
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

Handler.prototype.getPlayerServerIds = function(){
	var serverIds = [];
	for (var player in this.playerMap){
		serverIds.push({uid: playerMap[player].userId, sid: playerMap[player].serverId});
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
				balance: playerMap[player].balance,
				place: playerMap[player].place
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
				balance: playerMap[player].balance,
				place: playerMap[player].place
			}
			teammates.push(param);
		}
	}
	return teammates;
}

Handler.prototype.getPlayerHandCard = function(userId){
	for (var player in this.playerMap) {
		if (player === userId) {
			var param = {cards: this.playerMap[player].handCard, pattern: this.playerMap[player].handPattern};
			return param;
		}
	}
	return null;
}

Handler.prototype.updatePlayerBet = function(userId, amount) {
	this.allFund += parseInt(amount) > 0 ? parseInt(amount) : 0;
	this.playerBet[userId] += parseInt(amount) > 0 ? parseInt(amount) : 0;
	userAccount.updateAccount(userId, amount, function(error, result){
		if (!error) {
			return true;
		} else {
			return false;
		}
	})
}

Handler.prototype.playerDiscard = function(userId, amount) {
	this.activeNum -= 1;
	for (var player in this.playerMap) {
		if (player === userId) {
			this.playerMap[player].handStatus = 2;
			return true;
		}
	}
	return false;
}

Handler.prototype.getNextPlayer = function(userId){
	var index = 0;
	for (var player in this.playerMap) {
		++index;
		if (player === userId) {
			break;
		}
	}

	if (index === this.getPlayerNum) {
		for (var player in this.playerMap) {
			if (player !== userId && this.playerMap[player]['handStatus'] != 2) {
				return player;
			}
		}
	}

	var counter = 0;
	for (var player in this.playerMap) {
		++counter;
		if (counter <= this.getPlayerNum){
			if (counter > index && player !== userId && this.playerMap[player]['handStatus'] != 2) {
				return player;
			}
		}		
	}

	if (counter === this.getPlayerNum) {
		for (var player in this.playerMap) {
			if (player !== userId && this.playerMap[player]['handStatus'] != 2) {
				return player;
			}
		}
	}

	return null;
}

Handler.prototype.getCompareHandCard = function(ownId, ownHandCard, otherId, otherHandCard, initiative) {
	var res = logic.getCompareHandCard(ownHandCard, otherHandCard, initiative);
	if (res !== 0 && res === code.Card.WIN) {
		this.activeNum -= 1;
		this.playerMap[otherId].handStatus = 2;
		return true;
	} else if (res !== 0 && res === code.Card.LOSE) {
		this.activeNum -= 1;
		this.playerMap[ownId].handStatus = 2;
		return false;
	}

	return null;
}

Handler.prototype.getActiveUserId = function (userId){
	var players = [];
	for (var player in this.playerMap) {
		if (player != userId && this.playerMap[player].handStatus != 2) {
			players.push(player);
		}
	}
	return players;
}



function doAddPlayer(teamObj, userId, serverId) {
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

				User.userId = userId|0;
				User.username = res[0].username|'';
				User.avatar = res[0].avatar|'';
				User.balance = res[0].balance|0;
				User.serverId = serverId;
				User.place = teamObj.getPlayerPlace(teamObj.placeArray);
				teamObj.placeArray.push(User.place);

				User.handCard = handCard.cards|[];
				User.handPattern = handCard.pattern;
				User.handStatus = 0;

				teamObj.playerMap[userId] = User;

			}
		}
		
		return 0;
	})
}

function getPlayerPlace(placeArray){
	var str = placeArray.toString();
	for (var i=1; i<=5; ++i) {
		if (str.indexOf(i) === -1) {
			return i;
		}
	}
	return null;
}

function getPlayerPlaceIndex(place, placeArray) {
	for (var i=0; i<placeArray.length; ++i) {
		if (place === placeArray[i]) {
			return i;
		}
	}
	return null;
}






