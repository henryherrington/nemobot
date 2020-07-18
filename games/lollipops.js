'use strict';

const lollipopStr = (num) => {
	return (new Array(num)).fill('🍭').join('');
};
const ranInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
};


const start = (say, sendButton) => {
	const str = lollipopStr(12);	
	say(str).then(() => {
        sendButton('would you like to pick first?', [{title: 'Yes', payload: '12-1'}, {title: 'No', payload: '12-0'}]);
    });
};

const state = (payload, say, sendButton) => {
	const ary = payload.split('-');
	const currentNum = parseInt(ary[0]);
	const playerTurn = parseInt(ary[1]);

	if (playerTurn === 1) {
		if (currentNum === 0) {
			say('🎉 Congratulations! You have forced me to take the last lollipop!').then(() => {
				sendButton('Play again?', [
					{title: 'Yes!', payload: 'restart'},
					'No'
				]);
			});
		}
		else {
			const str = lollipopStr(currentNum);
			const btnNums = [1, 2, 3].slice(0, currentNum);
			const buttons = btnNums.map(num => ({title: String(num), payload: `${currentNum - num}-${0}`}));

			say(str).then(() => {
                sendButton('It\'s your turn now! How many lollipops would you like to take?', buttons);
			});
		}
	}
	else if (playerTurn === 0) {
		if (currentNum === 0) {
			say('You\'ve taken the last lollipop and lose!').then(() => {
				sendButton('Try again?', [
					{title: 'Yes!', payload: 'restart'},
					'No'
				]);
			});
		}
		else {
			const str = lollipopStr(currentNum);
			say(str).then(() => {
				const remainder = (currentNum - 1) % 4;
				const pick = (remainder === 0) ? ranInt(1, Math.min(currentNum, 3) + 1) : remainder;
				
				say(`It\'s my turn now, and I will pick ${pick} lollipops` ).then(() => {
                    const payloadStr = `${currentNum - pick}-${1}`;
                    state(payloadStr, say, sendButton);
				});
			});	
		}
	}
};

module.exports = {
	filename: 'lollipops',
	title: 'Fish-Flavored Lollipops',
	introduction: [
		'Fish-Flavored Lollipops is a variant of Nim, an ancient math puzzle.',
		'When the game starts, I will show you 12 lollipops, where the last one of them is fish-flavored. It tastes so disgusting that nobody wants to eat it.',
		'The lollipops will be placed in one line, and you and I will take turns to take lollipops from the row. You can\'t take more than 3 lollipops at a time, and you can\'t skip your turn. Whoever takes the last lollipop (the fish-flavored one) lose the game.'
	],
	start: start,
	state: state
};