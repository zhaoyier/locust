var Team = require('../domain/entity/xxTeam');

var handler = module.exports;

//global team container(teamId: teamObj)
var gTeamObjDict = {};
//global team id
var gTeamId = 0;

handler.createTeam = function(args){
	var teamObj = new Team(++gTeamId);
	var result = teamObj.addPlayer(args);
	if (result === 0){
		gTeamObjDict[teamObj.teamId] = teamObj;
	}
	return {code: result, teamObj: teamObj};
}

handler.getOptimalRoomId = function(args){
	if (Object.keys(gTeamObjDict).length > 0){
		for (var i in gTeamObjDict){
			var teamObj = gTeamObjDict[i];
			if (teamObj.isTeamHasPosition() && teamObj.getPlayerNum() >= 3){
				var result = teamObj.addPlayer(args);
				if (result === 0){
					return {code: 0, teamObj: teamObj};
				}
			}
		}

		for (var i in gTeamObjDict){
			var teamObj = gTeamObjDict[i];
			if (teamObj.isTeamHasPosition()){
				var result = teamObj.addPlayer(args);
				if (result === 0){
					return {code: 0, teamObj: teamObj};
				}
			}
		}
	}
	return createTeam(args);
}




