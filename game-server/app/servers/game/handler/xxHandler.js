
module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

var handler = Handler.prototype;

handler.xxEnter = function(msg, session, next){
	next(null, {code: 200, number:2});
}

//
handler.xxDeal = function(msg, session, next){

}

//
handler.xxCheck = function(msg, session, next){

}

//
handler.xxRise = function(msg, session, next){

}

//放弃
handler.xxDiscard = function(msg, session, next){

}

handler.xxCompare = function(msg, session, next){

}

handler.xxGuzhuyizhi = function(msg, session, next){

}

var doSettlementGame = function(msg, session, next){

}

var pushMessageToPlayer = function(uid, route, msg){

}

var pushMessageByUids = function(uids, route, msg){
	
}
