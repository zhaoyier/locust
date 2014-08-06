var Code = require('../../../domain/code/general');
var dispatcher = require('../../../util/dispatcher');



module.exports = function(app){
	return new AuthRemote(app);
}

var AuthRemote = function(app){
	this.app = app;
	this.uidMap = {};
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

AuthRemote.prototype.entryGame = function(uid, sid, ip, callback){
	var date = new Date();
	var record = {sid: sid, host: ip, time: date.getTime()};
	this.uidMap[uid] = record;
	console.log("*******entryGame*******:\t", this.uidMap);
}

AuthRemote.prototype.getServerId = function(uid){
	var res = this.uidMap[uid];

	if (res === undefined){
		return null;
	}
	else {
		return res[sid];
	}
}

AuthRemote.prototype.kick = function(uid, sid, name){
	console.log('********kick************:\t', uid, sid, name);
	var res = this.uidMap[uid];
	if (res !== undefined){
		delete this.uidMap[uid];
	}
}

AuthRemote.prototype.getServerIds = function(acccountIDS){
	var results = [];
	for (var i = 0; i < acccountIDS.length; i++) {
		var res = this.uidMap[acccountIDS[i]];
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

