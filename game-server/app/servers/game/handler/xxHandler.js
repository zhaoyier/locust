
module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

Handler.prototype.enterRoom = function(msg, session, next){
	next(null, {code: 200, number:2});
}