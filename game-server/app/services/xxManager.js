var Team = require('../domain/entity/xxTeam');

var handler = module.exports;

//global team container(teamId: teamObj)
var gTeamObjDict = {};
//global team id
var gTeamId = 0;

handler.initTeam = function(teamId) {

}

handler.createTeam = function(userId, serverId){
	var teamObj = new Team(++gTeamId);
	var result = teamObj.addPlayer(userId);
	if (result === 0){
		gTeamObjDict[teamObj.teamId] = teamObj;
		return teamObj.teamId;
	}
	return 0;
}
/*
*function: 
*params: 
**/
handler.getOptimalRoomId = function(userId, serverId){
	if (Object.keys(gTeamObjDict).length > 0){
		for (var i in gTeamObjDict){
			var teamObj = gTeamObjDict[i];
			if (teamObj.isTeamHasPosition() && teamObj.getPlayerNum() >= 3){
				var result = teamObj.addPlayer(userId, serverId);
				if (result === 0){
					return teamObj.teamId;
				}
			}
		}

		for (var i in gTeamObjDict){
			var teamObj = gTeamObjDict[i];
			if (teamObj.isTeamHasPosition()){
				var result = teamObj.addPlayer(userId, serverId);
				if (result === 0){
					return teamObj.teamId;
				}
			}
		}
	}
	return createTeam(userId, serverId);
}

/*
*function: 
*params: 
**/
handler.getTeammateServerIds = function(userId, teamId){
	var teamObj = gTeamObjDict[teamId];
	if (teamObj !== undefined){
		return teamObj.getTeammateServerIds(userId);
	}
	
	return null;
}

/*
*function: 
*params: 
**/
handler.getPlayerServerIds = function(teamId) {
	var teamObj = gTeamObjDict[teamId];
	if (teamObj !== undefined){
		return teamObj.getPlayerServerIds();
	}
	
	return null;
}

/*
*function: 
*params: 
**/
handler.getPlayerBasicInfo = function(userId, teamId){
	var teamObj = gTeamObjDict[teamId];
	if (teamObj !== undefined){
		return teamObj.getPlayerBasicInfo(userId);
	}
	
	return null;
}

/*
*function: 
*params: 
**/
handler.getTeammateBasicInfo = function(userId, teamId){
	var teamObj = gTeamObjDict[teamId];
	if (teamObj !== undefined){
		return teamObj.getTeammateBasicInfo(userId);
	}
	
	return null;
}

/*
*function: 
*params: 
**/
handler.isStartGame = function(teamId){
	var teamObj = gTeamObjDict[teamId];
	if (teamObj){
		if (teamObj.isStartGame()){
			return true;
		}

		if (teamObj.getPlayerNum() <= 2){
			return false;
		}

		if ((Date.now() - teamObj.getStartTime()) >= 0){
			teamObj.setStartGame();
			return true;
		} else {
			return false;
		} 
	}
	return null;
}

/*
*function: 
*params: 
**/
handler.getPlayerHandCard = function(userId, teamId){
	var teamObj = gTeamObjDict[teamId];
	if (teamObj){
		return teamObj.getPlayerHandCard(userId);
	}
	return null;
}

/*
*function: 
*params: 
**/
handler.updatePlayerBet = function(userId, amount, teamId) {
	var teamObj = gTeamObjDict[teamId];
	if (teamObj){
		return teamObj.updatePlayerBet(userId, amount);
	}
	return null;
}

/*
*function: 
*params: 
**/
handler.playerDiscard = function(userId, teamId) {
	var teamObj = gTeamObjDict[teamId];
	if (teamObj) {
		return teamObj.playerDiscard(userId, amount);
	}
	return null;
}

/*
*function: 
*params: 
**/
handler.getNextPlayer = function(userId, teamId) {
	var teamObj = gTeamObjDict[teamId];
	if (teamObj) {
		return teamObj.getNextPlayer(userId);
	}
	return null;
}

/*
*function: 
*params: 
**/
handler.playerLeave = function(userId, teamId) {
	var teamObj = gTeamObjDict[teamId];
	if (teamObj) {
		return teamObj.removePlayer(userId);
	}
	return null;
}

/*
*function: 
*params: 
**/
handler.getCompareHandCard = function(ownId, otherId, teamId){
	var teamObj = gTeamObjDict[teamId];
	if (teamObj) {
		var ownHandCard = teamObj.getPlayerHandCard(ownId);
		var otherHandCard = teamObj.getPlayerHandCard(otherId);
		return teamObj.getCompareHandCard(ownId, ownHandCard, otherId, otherHandCard, true);
	}
	return null;
}

/*
*function: 
*params: 
**/
handler.getActiveNumber = function(teamId){
	var teamObj = gTeamObjDict[teamId];
	if (teamObj) {
		return teamObj.getActiveNum();
	}

	return null;
}

/*
*function: 
*params: 
**/
handler.getAllFund = function(teamId) {
	var teamObj = gTeamObjDict[teamId];
	if (teamObj) {
		return teamObj.getAllFund();
	}

	return null;
}

/*
*function: 
*params: 
**/
handler.getPlayerBet = function(teamId) {
	var teamObj = gTeamObjDict[teamId];
	if (teamObj) {
		return teamObj.getPlayerBet();
	}

	return null;
}

/*
*function: 
*params: 
**/
handler.getActiveUserId = function(userId, teamId){
	var teamObj = gTeamObjDict[teamId];
	if (teamObj) {
		return teamObj.getActiveUserId(userId);
	}
	return null;
}