export const GAME = {
	STATUS: {
		IN_PROGRESS: 'IN_PROGRESS', 
		PLAYER_BUST: 'PLAYER_BUST',
		PLAYER_WINS: 'PLAYER_WINS',
		DEALER_WINS: 'DEALER_WINS',
		DRAW: 'DRAW',
		DEALER_IS_IN_PLAY: 'DEALER_IS_IN_PLAY', 
	},
};

export const PLAYERS = {
	DEALER: 'DEALER',
	PLAYER: 'PLAYER',
};

export const CARDS = {
	SUITS: ['clubs', 'hearts', 'spades', 'diamonds'],
	FACE_VALUES: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
	FACE_VALUES_COUNT: 13,
	ACE_HIGH: 'HIGH',
	ACE_LOW: 'LOW',
	ACE_VALUE_HIGH: 11,
	ACE_VALUE_LOW: 1,
};

export const GAME_PARAMETERS = {
	DEALER_STICK_VALUE: 17,
	BLACKJACK_VALUE: 21,
};

export const CARD_FACE_VALUES = {
	1: 'a',
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	10: 10,
	11: 'j',
	12: 'q',
	13: 'k',
};
