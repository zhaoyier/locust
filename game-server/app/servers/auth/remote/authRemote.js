var Code = require('../../../domain/code/general');
var dispatcher = require('../../../util/dispatcher');



module.exports = function(app){
	return new AuthRemote(app);
}

var AuthRemote = function(app){
	this.app = app;
	this.accountIDMap = {};
	this.tokenMap = {};
}

/*AuthRemote.prototype.addToken = function(username, token, ip){
	var date = new Date();
	var record = {token: token, time: date.getTime()};
	this.tokenMap[username] = record;

	return Code.OK;
}

AuthRemote.prototype.checkToke = function(username, token){
	var res = this.tokenMap[username];
	if (res === undefined || res['token'] !== token){
		return Code.FAIL;
	}
	
	if (new Date().getTime() - res['time'] > 3000){
		return Code.ENTRY.FA_TOKEN_EXPIRE;
	}

	return Code.OK;
}*/

AuthRemote.prototype.entryGame = function(accountID, sid, ip, callback){
	var date = new Date();
	var record = {sid: sid, host: ip, time: date.getTime()};
	this.accountIDMap[accountID] = record;
	console.log("*******entryGame*******:\t", this.accountIDMap);
}

AuthRemote.prototype.getServerId = function(accountID){
	var res = this.accountIDMap[accountID];

	if (res === undefined){
		return null;
	}
	else {
		return res[sid];
	}
}

AuthRemote.prototype.getServerIds = function(acccountIDS){
	var results = [];
	for (var i = 0; i < acccountIDS.length; i++) {
		var res = this.accountIDMap[acccountIDS[i]];
		if (res != undefined){
			results.push(res[sid]);
		}
	}
	return results;
}



var getSidByUid = function(username, app){
	var connector = dispatcher.dispatch(username, app.getServersByType('connector'));

	if (connector){
		return connector.id;
	}
	return null;
}

