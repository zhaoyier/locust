var data = require('./xxProtocolData');

var player =new data.Player({username: 'zhaoyier', balance: 1000, avatar: '3'});
console.log(player);

var card = new data.Card({hand: [2, 3, 5], pattern: 3});

console.log(card);