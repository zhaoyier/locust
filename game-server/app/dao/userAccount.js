var utils = require('../util/utils');

var userAccount = module.exports;

userAccount.createAccount = function(userId, amount, callback){
	utils.invokeCallback(callback, null, {userId: 100, balance: 200});
}

userAccount.updateAccount = function(userId, amount, callback){
	utils.invokeCallback(callback, null, {userId: 100, balance: 200});
}

userAccount.queryAccount = function(userId, callback){
	utils.invokeCallback(callback, null, {userId: 100, balance: 200});
}

userAccount.recordRecharge = function(userId, recharge, callback){
	utils.invokeCallback(callback, null, {userId: 100, status: true});
}

