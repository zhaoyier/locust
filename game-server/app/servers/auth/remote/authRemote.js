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

AuthRemote.prototype.entryGame = function(uid, sid, ip, callback){
	var date = new Date();
	var record = {sid: sid, host: ip, time: date.getTime()};
	this.uidMap[uid] = record;
	console.log("*******entryGame*******:\t", this.uidMap, "uid:\t", uid, "sid:\t", sid, "host:\t", ip);
	callback(null);
}

AuthRemote.prototype.getServerId = function(uid, callback){
	var res = this.uidMap[uid];

	if (res === undefined){
		callback(201);
	}
	else {
		callback(null, res[sid]);
	}
}

AuthRemote.prototype.kick = function(uid, sid, name, callback){
	console.log('********kick************:\t', uid, sid, name);
	var res = this.uidMap[uid];
	if (res !== undefined){
		delete this.uidMap[uid];
		callback(null, uid);
	}
}

AuthRemote.prototype.getServerIds = function(uids){
	var results = [];
	for (var i = 0; i < uids.length; i++) {
		var res = this.uidMap[uids[i]];
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

