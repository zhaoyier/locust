var logic = require('../logic/xxLogic');
var poker = require('../statistic/poker');
var protocol = require('../statistic/xxProtocolData');

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
Handler.prototype.addPlayer = function(args){
	if (!args || typeof args !== 'object') {
		return 2;
	}
	if (!this.isTeamHasPosition()) {
		return 3;
	}
	if (this.isPlayerInTeam(args.uid)) {
		return 4;
	}

	if (this.playerNum < MAX_MEMBER_NUM){
		this.playerNum++;
	}

	doAddPlayer(this, args);
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

Handler.prototype.getTeamPlayerServerId = function(){
	var players = [];
	for (var i in playerMap){
		players.push({userId: playerMap[i].userId, serverId: playerMap[i].serverId});
	}
	return players;
}

function doAddPlayer(teamObj, args) {
	var handCard = logic.creatHandCard(teamObj.deckCards);

	var player = new protocol.Player(args);
	player.handCard = handCard.cards;
	player.handPattern = handCard.pattern;

	teamObj.playerMap[args.uid] = player;
}





