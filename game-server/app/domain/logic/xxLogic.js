var code = require('../code/xxCode');

var handler = module.exports;

handler.createHandCardsAsPattern = function(residueCards, pattern, callback){
	switch(pattern){
		case code.Type.DANZHANG:
			{
				break;
			} 
		case code.Type.DUIZI:
			{
				break;
			}
		case code.Type.SHUNZI:
			{
				break;
			}
		case code.Type.JINHUA:
			{
				break;
			}
		case code.Type.SHUNJIN:
			{
				break;
			}
		case code.Type.BAOZI:
			{
				break;
			}
		case code.Type.TESHU:
			{
				break;
			}
		default:{

		}
	}
}

handler.creatHandCard = function(residueCards, option){
	//console.log(residueCards);
	var randomNum = this.createRandomOne(100);
	//console.log("randomNum:\t", randomNum);

	if (randomNum >=0 && randomNum <= 10){
		return this.createXXDanzhang(residueCards);
	} else if (randomNum >= 11 && randomNum <= 30){
		return this.createXXDuizi(residueCards);
	} else if (randomNum >= 31 && randomNum <= 50){
		return this.createXXShunzi(residueCards);
	} else if (randomNum >= 51 && randomNum <= 70){
		return this.createXXJinhua(residueCards);
	} else if (randomNum >= 71 && randomNum <= 80){
		return this.createXXShunjin(residueCards);
	} else if (randomNum >= 81 && randomNum <= 90){
		return this.createXXBaozi(residueCards);
	} else {
		return this.createXXTeshu(residueCards);
	}
}

/*
 * *function: 卡牌生成
 * */
/*
 * *function: 生成炸弹牌
 * */
//handler.createXXBaozi = function(residueCards, cardValue){
handler.createXXBaozi = function(residueCards){
	var handCards = {cards: [], pattern: code.Type.BAOZI};
	var cardValue = this.createRandomOne(code.Constant.MAX_CARD_VALUE);

	while(true){
		var counterCard = this.cumulativeCardNumber(residueCards, cardValue);
		if (counterCard === 3){
			for (var i = 0; i < code.Constant.CARD_COLOR; ++i) {
				var index = this.getCardIndexAsValue(residueCards, (i*code.Constant.HEX_VALUE+cardValue));
				if (index !== null){
					handCards.cards.push(residueCards[index]);
					residueCards.splice(index, 1);
				}
			}
			return handCards;
		} else if (counterCard === 4){
			var abandonColor = this.createRandomZero(4);
			for (var i = 0; i < code.Constant.CARD_COLOR; i++) {
				if (i != abandonColor){
					var index = this.getCardIndexAsValue(residueCards, (i*code.Constant.HEX_VALUE+cardValue));
					handCards.cards.push(residueCards[index]);
					residueCards.splice(index, 1);
				}
			}
			return handCards;
		} else {
			cardValue = this.createRandomOne(code.Constant.MAX_CARD_VALUE);
		}
	}
}

/*
*function: 生成对子
**/
//handler.createXXDuizi = function(residueCards, cardValue){
handler.createXXDuizi = function(residueCards){
	var handCards = {cards:[], pattern: code.Type.DUIZI};
	var cardValue = this.createRandomOne(code.Constant.MAX_CARD_VALUE);

	while(true){
		var counterCard = this.cumulativeCardNumber(residueCards, cardValue);
		if (counterCard === 2){
			for (var i = 0; i < code.Constant.CARD_COLOR; i++) {
				var index = this.getCardIndexAsValue(residueCards, (i*code.Constant.HEX_VALUE+cardValue));
				if (index <= null){
					handCards.cards.push(residueCards[index]);
					residueCards.splice(index, 1);
				}	
			}

			while(true){
				var singleCardIndex = this.createRandomZero(residueCards.length);
				if (this.analyseCardValue(residueCards[singleCardIndex]) !== cardValue){
					handCards.cards.push(residueCards[singleCardIndex]);
					residueCards.splice(singleCardIndex, 1);
					return handCards;
				}
			}			
		} else if (counterCard >= 3){
			var indexArray = this.getCardIndexArrayAsValue(residueCards, cardValue);
			var index = indexArray[this.createRandomZero(indexArray.length)];
			handCards.cards.push(residueCards[index]);
			residueCards.splice(index, 1);

			indexArray = this.getCardIndexArrayAsValue(residueCards, cardValue);
			index = indexArray[this.createRandomZero(indexArray.length)];
			handCards.cards.push(residueCards[index]);
			residueCards.splice(index, 1);

			while(true){
				var singleCardIndex = this.createRandomZero(residueCards.length);
				if (this.analyseCardValue(residueCards[singleCardIndex]) !== cardValue){
					handCards.cards.push(residueCards[singleCardIndex]);
					residueCards.splice(singleCardIndex, 1);
					return handCards;
				}
			}
		} else {
			cardValue = this.createRandomOne(code.Constant.MAX_CARD_VALUE);
		}
	}

}

//handler.createXXShunjin = function(residueCards, cardValue){
handler.createXXShunjin = function(residueCards){
	var handCards = {cards:[], pattern: code.Type.SHUNJIN};
	var cardValue = residueCards[this.createRandomZero(residueCards.length)];

	while (true){
		if (this.analyseCardValue(cardValue) <= 2){
			var counter = 0;
			for (var i = cardValue; i < cardValue+3; i++) {
				if (this.getCardIndexAsValue(residueCards, i) !== null){
					++counter;
				}
			}
			if (counter === 3){
				for (var i = cardValue; i < cardValue+3; i++) {
					var index = this.getCardIndexAsValue(residueCards, i);
					handCards.cards.push(residueCards[index]);
					residueCards.splice(index, 1);	
				}
				return handCards;
			} else {
				cardValue = residueCards[this.createRandomZero(residueCards.length)];
			}
		} else {
			var subCounter = 0, addCounter = 0;
			for (var i = cardValue-2; i <= cardValue; i++) {
				if (this.getCardIndexAsValue(residueCards, i) !== null){
					++subCounter;
				}
			}
			if (subCounter === 3){
				for (var i = cardValue-2; i <= cardValue; i++) {
					var index = this.getCardIndexAsValue(residueCards, i);
					handCards.cards.push(residueCards[index]);
					residueCards.splice(index, 1);
				}
				return handCards;
			} else {
				for (var i = cardValue; i < cardValue+3; ++i){
					if (this.getCardIndexAsValue(residueCards, i) !== null){
						++addCounter;
					}
				}
				if (addCounter === 3){
					for (var i = cardValue; i < cardValue+3; i++) {
						var index = this.getCardIndexAsValue(residueCards, i);
						handCards.cards.push(residueCards[index]);
						residueCards.splice(index, 1);
					}
					return handCards;
				} else {
					cardValue = residueCards[this.createRandomZero(residueCards.length)];
				}
			}
		}
	}
}

//handler.createXXJinhua = function(residueCards, cardValue){
handler.createXXJinhua = function(residueCards){
	var handCards = {cards:[], pattern: code.Type.JINHUA};
	var cardValue = residueCards[this.createRandomZero(residueCards.length)];

	while (true){
		var indexArray = this.getCardIndexArrayAsColor(residueCards, this.analyseCardColor(cardValue));
		if (indexArray >= 3){
			for (var i = 0; i < code.Constant.HAND_CARD; i++) {
				var index = this.createRandomZero(indexArray.length);
				var selectCard = residueCards[indexArray[index]];
				handCards.cards.push(selectCard);
				indexArray.splice(index, 1);	
				this.removeCardAsCardValue(residueCards, selectCard);
			}
			handCards.cards.sort(sortNumber);
			if ((handCards.cards[0]+1 === handCards.cards[1]) && (handCards.cards[1]+1 === handCards.cards[2])){
				handCards.pattern = code.Type.SHUNJIN;
			}
			return handCards;
		} else {
			cardValue = residueCards[this.createRandomZero(residueCards.length)];
		}
	}
}

//handler.creatXXShunzi = function(residueCards, cardValue){
handler.createXXShunzi = function(residueCards){
	var handCards = {cards:[], pattern: code.Type.SHUNZI};
	var cardValue = this.createRandomOne(code.Constant.MAX_CARD_VALUE);

	while (true){
		if (cardValue <= 2){
			var counter = 0;
			for (var i = cardValue; i < cardValue+3; i++) {
				var indexArray = this.getCardIndexArrayAsValue(residueCards, i);
				if (indexArray.length >= 1){
					++counter;
				}	
			}
			if (counter === 3){
				for (var i = cardValue; i < cardValue+3; i++) {
					var indexArray = this.getCardIndexArrayAsValue(residueCards, i);
					var index = indexArray[this.createRandomZero(indexArray.length)];
					handCards.cards.push(residueCards[index]);
					residueCards.splice(index, 1);
				}
				handCards.cards.sort(sortNumber);
				if ((this.analyseCardColor(handCards.cards[0]) === this.analyseCardColor(handCards.cards[1])) 
					&& (this.analyseCardColor(handCards.cards[1]) === this.analyseCardColor(handCards.cards[2]))){
					handCards.pattern = code.Type.SHUNJIN;
				}
				return handCards;
			} else {
				cardValue = this.createRandomOne(code.Constant.MAX_CARD_VALUE);
			}
		} else {
			var subCounter = 0, addCounter = 0;

			for (var i = cardValue-2; i <= cardValue; i++) {
				var indexArray = this.getCardIndexArrayAsValue(residueCards, i);
				if (indexArray.length >= 1){
					++subCounter;
				}	
			}

			if (subCounter === 3){
				for (var i = cardValue-2; i <= cardValue; i++) {
					var indexArray = this.getCardIndexArrayAsValue(residueCards, i);
					var index = indexArray[this.createRandomZero(indexArray.length)];
					handCards.cards.push(residueCards[index]);
					residueCards.splice(index, 1);
				}
				handCards.cards.sort(sortNumber);
				if ((this.analyseCardColor(handCards.cards[0]) === this.analyseCardColor(handCards.cards[1])) 
					&& (this.analyseCardColor(handCards.cards[1]) === this.analyseCardColor(handCards.cards[2]))){
					handCards.pattern = code.Type.SHUNJIN;
				}
				return handCards;

			} else {
				for (var i = cardValue; i < cardValue+3; i++) {
					var indexArray = this.getCardIndexArrayAsValue(residueCards, i);
					if (indexArray.length >= 1){
						++addCounter;
					}	
				}

				if (addCounter === 3){
					for (var i = cardValue; i < cardValue+3; i++) {
						var indexArray = this.getCardIndexArrayAsValue(residueCards, i);
						var index = indexArray[this.createRandomZero(indexArray.length)];
						handCards.cards.push(residueCards[index]);
						residueCards.splice(index, 1);
					}
					if ((this.analyseCardColor(handCards.cards[0]) === this.analyseCardColor(handCards.cards[1])) 
					&& (this.analyseCardColor(handCards.cards[1]) === this.analyseCardColor(handCards.cards[2]))){
						handCards.pattern = code.Type.SHUNJIN;
					}
					return handCards;
				} else {
					cardValue = this.createRandomOne(code.Constant.MAX_CARD_VALUE);
				}
			}
		}
	}
}

handler.createXXDanzhang = function(residueCards){
	var handCards = {cards:[], pattern: code.Type.DANZHANG};

	while (true){
		var index = this.createRandomZero(residueCards.length);
		if (handCards.cards.length === 0){
			handCards.cards.push(residueCards[index]);
			residueCards.splice(index, 1);
		}
		else if (handCards.cards.length === 1){
			var selectCardValue = this.analyseCardValue(residueCards[index]);
			var handCardValue = this.analyseCardValue(handCards.cards[0]);
			if (selectCardValue != handCardValue){
				handCards.cards.push(residueCards[index]);
				residueCards.splice(index, 1);
			}
		}
		else if (handCards.cards.length === 2){
			if ((this.analyseCardValue(residueCards[index]) != this.analyseCardValue(handCards.cards[0]))
				&& this.analyseCardValue(residueCards[index]) != this.analyseCardValue(handCards.cards[1])){
				if (this.analyseCardColor(residueCards[index]) != this.analyseCardColor(handCards.cards[0])){
					handCards.cards.push(residueCards[index]);
					residueCards.splice(index, 1);
				}
				else if (this.analyseCardColor(residueCards[index]) != this.analyseCardColor(handCards.cards[1])){
					handCards.cards.push(residueCards[index]);
					residueCards.splice(index, 1);
				}
			}

		}

		if (handCards.cards.length === 3){
			var handCardsValue = [];
			for (var i = 0; i < handCards.cards.length; i++) {
				handCardsValue.push(this.analyseCardValue(handCards.cards[i])); 
			}
			handCardsValue.sort(sortNumber);
			if (handCardsValue[0] === 2 && handCardsValue[1] === 3 && handCardsValue[2] === 5){
				if ((this.analyseCardColor(handCards.cards[0]) != this.analyseCardColor(handCards.cards[1]))
					&&(this.analyseCardColor(handCards.cards[0]) != this.analyseCardColor(handCards.cards[2]))
					&&(this.analyseCardColor(handCards.cards[1]) != this.analyseCardColor(handCards.cards[2]))){
					return {cards: handCards.cards, pattern: code.Type.TESHU};
				}
			}
			return handCards;	
		}
	}
}

handler.createXXTeshu = function(residueCards){
	var handCards = {cards:[], pattern: code.Type.TESHU};

	var selectCardTwo = this.getCardArrayAsCardValue(residueCards, 2);
	var selectCardThree = this.getCardArrayAsCardValue(residueCards, 3);
	var selectCardFive = this.getCardArrayAsCardValue(residueCards, 5);
	//console.log(selectCardTwo, selectCardThree, selectCardFive);
	if ((selectCardTwo.length === 0)||(selectCardThree.length === 0)||(selectCardFive.length === 0)){
		return this.createXXJinhua(residueCards);
	}
	else {
		var index = this.createRandomZero(selectCardTwo.length);
		handCards.cards.push(selectCardTwo[index]);
		this.removeCardAsCardValue(residueCards, selectCardTwo[index]);

		index = this.createRandomZero(selectCardThree.length);
		handCards.cards.push(selectCardThree[index]);
		this.removeCardAsCardValue(residueCards, selectCardThree[index]);
	
		index = this.createRandomZero(selectCardFive.length);
		handCards.cards.push(selectCardFive[index]);
		this.removeCardAsCardValue(residueCards, selectCardFive[index]);
	
		if ((this.analyseCardColor(handCards.cards[0]) != this.analyseCardColor(handCards.cards[1]))
			&& (this.analyseCardColor(handCards.cards[0]) != this.analyseCardColor(handCards.cards[2]))
			&& (this.analyseCardColor(handCards.cards[1]) != this.analyseCardColor(handCards.cards[2]))){
			return {cards: handCards.cards, pattern: code.Type.TESHU};
		}
		else {
			return {cards: handCards.cards, pattern: code.Type.DANZHANG};
		}
	}

}

/*
*function: 解析卡牌数值大小
**/
handler.analyseCardValue = function(cardValue){
	return parseInt(cardValue%code.Constant.HEX_VALUE);
}

/*
*function: 解析卡牌花色
**/
handler.analyseCardColor = function(cardValue){
	return parseInt(cardValue/code.Constant.HEX_VALUE);
}

/*
*function: 根据卡牌值累加各色数
***/
handler.cumulativeCardNumber = function(residueCards, cardValue){
	var counter = 0;
	for (var i = 0; i < code.Constant.CARD_COLOR; i++) {
		if (this.getCardIndexAsValue(residueCards, (i*code.Constant.HEX_VALUE+this.analyseCardValue(cardValue))) !== null){
			++counter;
		}
	}
	return counter;
}

/*
 * *function: 根据卡牌数值获取其下标
 * */
handler.getCardIndexAsValue = function(residueCards, cardValue){
	for (var i = 0; i < residueCards.length; i++) {
		if (residueCards[i] === cardValue){
			return i;
		}
	}
	return null;
}

/*
*funtion: 根据卡牌值获取所有下标值
**/
handler.getCardIndexArrayAsValue = function(residueCards, cardValue){
	var cardIndexArray = [];

	for (var i = 0; i < code.Constant.CARD_COLOR; i++) {
		var index = this.getCardIndexAsValue(residueCards, (i*code.Constant.HEX_VALUE+cardValue));
		if (index !== null){
			cardIndexArray.push(index);
		}	
	}
	return cardIndexArray;
}

/*
*function: 根据卡牌大小获取所有卡牌
**/
handler.getCardArrayAsCardValue = function (residueCards, cardValue){
	var cardArray = [];
	for (var i = 0; i < code.Constant.CARD_COLOR; i++) {
		var index = this.getCardIndexAsValue(residueCards, (i*code.Constant.HEX_VALUE+this.analyseCardValue(cardValue)));
		if (index !== null) {
			cardArray.push(residueCards[index]);
		}
	}
	return cardArray;
}
/*
*funtion: 根据卡牌色获取所有下标
**/
handler.getCardIndexAsColor = function (residueCards, cardColor){
	for (var i = 0; i < residueCards.length; i++) {
		if (this.analyseCardColor(residueCards[i]) === cardColor){
			return i;
		}
	}
	return null;
}

/*
*funtion: 根据卡牌色获取所有下标
**/
handler.getCardIndexArrayAsColor = function(residueCards, cardColor){
	var cardIndexArray = [];

	for (var i = 0; i < residueCards.length; i++) {
		if (this.analyseCardColor(residueCards[i]) === cardColor){
			cardIndexArray.push(i);
		}
	}
	return cardIndexArray;
}

/*
*function: 获取卡牌大小的数组
**/
handler.getCardsArrayAsValue = function(handCards){
	var handCardsValue = [];
	for (var i = 0; i < handCards.cards.length; i++) {
		handCardsValue.push(this.analyseCardValue(handCards.cards[i])); 
	}
	return handCardsValue.sort(sortNumber);
}

/*
*funtion: 根据卡牌值删除卡牌
**/
handler.removeCardAsCardValue = function(residueCards, cardValue){
	for (var i = 0; i < residueCards.length; i++) {
		if (residueCards[i] === cardValue){
			residueCards.splice(i, 1);
			return ;
		}
	}
}

/*
 * *function: 随机数生成
 * */
handler.createRandomZero = function(base){
	return parseInt(Math.random()*base);
}

handler.createRandomOne = function(base){
	return parseInt(Math.random()*base+1)
}

/*
 * *function: 分析卡牌信息
 * */
handler.getCardColor = function(cardValue){
	switch(parseInt(cardValue/16)){
		case 0: {
				return "方块";
			}
		case 1: {
				return "梅花";  
			}
		case 2: {
				return "红桃";
			}
		case 3: {
				return "黑桃";
			}
	}
}

/*
*function: 比较卡牌大小
**/
handler.getCompareSize = function(ownCards, otherCards, initiative){
	if (ownCards === undefined || otherCards === undefined){
		return 0;
	}

	if (ownCards.pattern > otherCards.pattern){
		return code.Card.WIN;
	}
	else if (ownCards.pattern < otherCards.pattern){
		return code.Card.LOSE;
	}
	else {
		var ownCardsValue = this.getCardsArrayAsValue(ownCards);
		var otherCardsValue = this.getCardsArrayAsValue(otherCards);

		if (ownCards.pattern === 1){
			if (ownCardsValue[2] != otherCardsValue[2]){
				return (ownCardsValue[2]>otherCardsValue[2]) ? code.Card.WIN : code.Card.LOSE;
			}
			else if (ownCardsValue[1] != otherCardsValue[1]){
				return (ownCardsValue[1]>otherCardsValue[1]) ? code.Card.WIN : code.Card.LOSE;
			}
			else if (ownCardsValue[0] != otherCardsValue[0]){
				return (ownCardsValue[0]>otherCardsValue[0]) ? code.Card.WIN : code.Card.LOSE;
			}
			else {
				return initiative ? code.Card.WIN: code.Card.LOSE;
			}
		}
		else if (ownCards.pattern === 2){
			var ownDuiziValue = (ownCardsValue[0]===ownCardsValue[1]) ? ownCardsValue[0] : ownCardsValue[2];
			var otherDuiziValue = (otherCardsValue[0]===otherCardsValue[1]) ? otherCardsValue[0] : otherCardsValue[2];
			if (ownDuiziValue === otherDuiziValue){
				var ownDanValue = (ownCardsValue[0] === ownCardsValue[1]) ? ownCardsValue[2]: ownCardsValue[0];
				var otherDanValue = (otherCardsValue[0] === otherCardsValue[1]) ? otherCardsValue[2]: otherCardsValue[0];
				if (ownDanValue === otherDanValue){
					return initiative ? code.Card.WIN: code.Card.LOSE;
				}
				else {
					return (ownDanValue > otherDanValue) ? code.Card.WIN : code.Card.LOSE;
				}
			}
			else {
				return (ownDuiziValue > otherDuiziValue) ? code.Card.WIN : code.Card.LOSE;
			}
		}
		else if (ownCards.pattern === 3){
			if (ownCardsValue[2] === otherCardsValue[2]){
				return initiative ? code.Card.WIN: code.Card.LOSE;
			}
			else {
				return (ownCardsValue[2] > otherCardsValue[2]) ? code.Card.WIN: code.Card.LOSE;
			}
		}
		else if (ownCards.pattern === 4){
			if (ownCardsValue[2] != otherCardsValue[2]){
				return (ownCardsValue[2]>otherCardsValue[2]) ? code.Card.WIN: code.Card.LOSE;
			}
			else if (ownCardsValue[1] != otherCardsValue[1]){
				return (ownCardsValue[1]>otherCardsValue[1]) ? code.Card.WIN: code.Card.LOSE;
			}
			else if (ownCardsValue[0] != otherCardsValue[0]){
				return (ownCardsValue[0]>otherCardsValue[0]) ? code.Card.WIN: code.Card.LOSE;
			}
			else {
				return initiative ? code.Card.WIN: code.Card.LOSE;
			}
		}
		else if (ownCards.pattern === 5){
			if (ownCardsValue[2] === otherCardsValue[2]){
				return initiative ? code.Card.WIN: code.Card.LOSE;
			}
			else {
				return (ownCardsValue[2] > otherCardsValue[2]) ? code.Card.WIN: code.Card.LOSE;
			}
		}
		else if (ownCards.pattern === 6){
			if (ownCardsValue[2] === otherCardsValue[2]){
				return initiative ? code.Card.WIN: code.Card.LOSE;
			}
			else {
				return (ownCardsValue[2] > otherCardsValue[2]) ? code.Card.WIN: code.Card.LOSE;
			}
		}
		else if (ownCards.pattern === 7){
			return initiative ? code.Card.WIN: code.Card.LOSE;
		}
	}
}


function sortNumber(a,b)
{
	return a - b;
}
