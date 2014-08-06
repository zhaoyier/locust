
module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

var handler = Handler.prototype;

handler.enterRoom = function(msg, session, next){
	next(null, {code: 200, number:2});
}


