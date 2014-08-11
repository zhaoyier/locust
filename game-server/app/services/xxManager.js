var Team = require('../domain/entity/xxTeam');

var handler = module.exports;

//global team container(teamId: teamObj)
var gTeamObjDict = {};
//global team id
var gTeamId = 0;

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



