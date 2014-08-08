module.exports.Player = function(args, userNo){
	this.userNo = userNo;
	this.userId = args.userId|0;
	this.username = args.username|'';
	this.balance = args.balance|0;
	this.avatar = args.avatar|'';
	this.serverId = args.serverId|0;

	this.handCard = args.hand|[];
	this.handPattern = args.pattern|0;
	this.handStatus = args.status|0;
}

/*module.exports.Card = function(args){
	this.handCard = args.hand|[];
	this.handPattern = args.pattern|0;
	this.handStatus = args.status|0;
}*/