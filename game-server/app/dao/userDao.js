var utils = require('../util/utils');


var userDao = module.exports;

userDao.loginAccount = function(username, password, callback){
	 utils.invokeCallback(callback, null, {wuid: 100});
}

userDao.registerAccount = function(username, password, callback){
	utils.invokeCallback(callback, null, {wuid: 100});
}


userDao.createPlayer = function(wuid, callback){
	utils.invokeCallback(callback, null, {id: 100, avatar: "1"});
}

userDao.getPlayerInfo = function(wuid, callback){
	utils.invokeCallback(callback, null, {id:100, name: "zhaoyier"});
}

userDao.updatePlayer = function(params, callback){
	utils.invokeCallback(callback, null, {id:100});
}


