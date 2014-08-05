var utils = require('../util/utils');


var userDao = module.exports;

userDao.verifyAccount = function(username, password, callback){
	 utils.invokeCallback(callback, null, {wuid: 100});
}

userDao.getPlayerInfo = function(wuid, callback){
	utils.invokeCallback(callback, null, {id:101, name: "zhaoyier"});
}

