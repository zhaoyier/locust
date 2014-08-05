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

AuthRemote.prototype.addToken = function(uid, token, ip){
	if (!!this.tokenMap[uid]){
		return Code.OK;
	}

	var date = new Date();
	var record = {token: token, time: date.getTime()};
	this.tokenMap[uid] = record;

	return Code.OK;
}

AuthRemote.prototype.checkToke = function(uid, token){
	var res = this.tokenMap[uid];
	if (res === undefined || res['token'] !== token){
		return Code.FAIL;
	}
	
	if (new Date().getTime() - res['time'] > 3000){
		return Code.ENTRY.FA_TOKEN_EXPIRE;
	}

	return Code.OK;
}

AuthRemote.prototype.addSid = function(uid, sid){
	if (!!this.uidMap[uid]){
		return Code.OK;
	}

	var date = new Date();
	var record = {sid: sid, time: date.getTime()};

	return Code.OK;
}

AuthRemote.prototype.querySid = function(){
	var res = this.uidMap[uid];

	if (res === undefined){
		return null;
	}
	else {
		return res[sid];
	}
}

var getSidByUid = function(uid, app){
	var connector = dispatcher.dispatch(uid, app.getServersByType('connector'));

	if (connector){
		return connector.id;
	}
	return null;
}

