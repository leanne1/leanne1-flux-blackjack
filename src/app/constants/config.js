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
};

export const GAME_PARAMETERS = {
	DEALER_STICK_VALUE: 17,
	
};