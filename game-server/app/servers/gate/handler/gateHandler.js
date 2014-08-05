var md5 = require('md5');
var dispatcher = require('../../../util/dispatcher');

module.exports = function(app){
    return new Handler(app);
}

var Handler = function(app){
    this.app = app;
}

Handler.prototype.queryEntry = function(msg, session, next) {
    var uid = msg.uid;
    if (!uid){
        next(null, {code: 0});
    }   
    else {
        var connectors = this.app.getServersByType('connector');
        if (!connectors || connectors.length === 0){ 
            next (null, {code: 0});
            return ;
        }   
        else {      	
        	var ip = session.__session__.__socket__.remoteAddress.ip;
            //var token = createToken(ip, uid);
            var res = dispatcher.dispatch(uid, connectors);
			this.app.rpc.auth.authRemote.addToken(session, uid, token);

            //next(null, {code: 200, host: res.host, port: res.clientPort, token: token});
            next(null, {code: 200, host: res.host, port: res.clientPort});
        }   
    }   
};

var createToken = function(ip, uid){
	var tag = "zhao";
	var date = new Date();
	return md5.digest_s("tag"+date.getFullYear().toString()+date.getMonth().toString()+ip.toString()+uid.toString());
}
