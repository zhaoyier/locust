module.exports = handler;
handler.User = function(args, userNo){
	this.userNo = userNo;
	this.userId = args.userId|0;
	this.username = args.username|'';
	this.avatar = args.avatar|'';
	this.balance = args.balance|0;	
	this.serverId = args.serverId|0;

	this.handCard = args.hand|[];
	this.handPattern = args.pattern|0;
	this.handStatus = args.status|0;
}

handler.xxAddPlayerToMateResp = function(args){
	
}

handler.xxAddPlayerToSelfResp = function(args){

}

handler.xxEnterGameReq = function(args){

}




