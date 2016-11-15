import EventEmitter from 'event-emitter';
import { knuthShuffle as shuffle } from 'knuth-shuffle';
import { PLAYERS, CARDS, GAME_PARAMETERS } from '../constants/config';
import AppDispatcher from '../dispatcher/AppDispatcher';
import actionTypes from '../constants/actionTypes'

const CHANGE_EVENT = 'change';

/**
 * Declare store shape.
 */
const deck = {
	undealtCards: null,
	dealerHiddenCard: null,
	hand: {
		[PLAYERS.PLAYER]: [],
		[PLAYERS.DEALER]: [],
	},
	blackJack: {
		[PLAYERS.PLAYER]: null,
		[PLAYERS.DEALER]: null,
	},
	isBust: {
		[PLAYERS.PLAYER]: null,
		[PLAYERS.DEALER]: null,
	},
};

/*++++++++++++++++++++
+ PRIVATE METHODS
+++++++++++++++++++++*/

/**
 * Create the card deck.
 * @return {array} card deck
 */
export const _createCardDeck = () => {
	const cardDeck = []; 
	CARDS.SUITS.forEach(suit => {
		let count = CARDS.FACE_VALUES_COUNT;
		while (count > 0) {
			let faceValue = count;
			let value = count >= 11 ? 10 : count;
			cardDeck.push({ suit, value, faceValue });
			count--;
		}
	});
	return cardDeck;
};

/**
 * Create a new card deck, shuffle it then cache it in the store.
 * @param {object} deck - deck object to add new deck to
 */
export const _newDeck = (deck) => {
	const newDeck = _createCardDeck();
	deck.undealtCards = shuffle(newDeck);
};

/**
 * Deal card/s from the start of the deck. Mutates deck.undealtCards length
 * @param {number} n - number of cards to take
 * @param {object} _deck - deck to mutate
 * @return {array} card/s removed from deck
 */
export const _dealCards = (n = 0, _deck = deck) => {
	return _deck.undealtCards.splice(0, n);
};

/**
 * Check whether the given hand is a BlackJack.
 * @param {array} hand - hand to check
 * @return {boolean} whether the hand is a Black Jack
 */
export const _isBlackJack = (hand) => {
	if (hand.length > 2) {
		return false;
	}
	const handValue = _getHandValue(hand);
	const hasAce = hand[0].faceValue === 1 || hand[1].faceValue === 1;
	return hasAce && handValue === 11;
};

/**
 * Get total hand value
 * @param {array} hand - hand whose value to calculate
 * @param {string} aceValue - low treats aces as 1; high treats aces as 11
 * @return {number} total value of the hand
 */
export const _getHandValue = (hand, aceValue = CARDS.ACE_LOW) => {
	return hand.reduce((prev, curr) => { 
		const currentValue = curr.value === 1 ? 
			aceValue === CARDS.ACE_HIGH ? 
				CARDS.ACE_VALUE_HIGH : CARDS.ACE_VALUE_LOW : curr.value;
		return prev + currentValue;
	}, 0);
};

/**
 * Check whether a given hand is bust.
 * Treats all aces as their low value.
 * @return {boolean} whether the hand is bust
 */
export const _isBust = (hand) => {
	return _getHandValue(hand) > GAME_PARAMETERS.BLACKJACK_VALUE;
};

/**
 * Dealer hit. Called recursively until dealer hand >= 17.
 * For simplicity, the dealer treats all aces as high. This could be corrected
 * with additional logic around whether to treat an ace as high or low dependent
 * on the values of the other cards in the hand
 * @param {array} hand - dealer's current hand
 * @return {array} hand - the dealer's next hand
 */
export const _dealerHit = (hand) => {
	const dealerHandValue = _getHandValue(hand, CARDS.ACE_HIGH);
	const dealerMustHit = dealerHandValue < GAME_PARAMETERS.DEALER_STICK_VALUE;
	if (dealerMustHit) {
		return _dealerHit([...hand, ...(_dealCards(1))]);
	} else {
		return hand;
	}
};

/**
 * Get the strongest (greatest value) hand depdendent on the value of any aces in the hand.
 * Aces are treated as high unless a high ace value makes the hand value bust.
 * @param {string} hand - hand's whose hand to calculate
 * @return {number} value of the player's strongest hand
 */
export const _getStrongestHandValue = (hand) => {
	const lowHand = _getHandValue(hand);
	const highHand = _getHandValue(hand, CARDS.ACE_HIGH);
	return highHand > GAME_PARAMETERS.BLACKJACK_VALUE ? lowHand : highHand;
};

/*++++++++++++++++++++
+ CHANGE HANDLER
+++++++++++++++++++++*/

/**
 * Store callback invoked by action dispatch.
 * @param {object} action - action object
 * @return {boolean} true
 */
const registeredCallback = ({ action }) => {
	switch(action.actionType) {
	 	case actionTypes.DECK_DEAL:
	 		_newDeck(deck);
	 		deck.hand[PLAYERS.DEALER] = _dealCards(2);
	 		deck.hand[PLAYERS.PLAYER] = _dealCards(2);
	 		deck.dealerHiddenCard = 0;
	 		deck.blackJack[PLAYERS.PLAYER] = _isBlackJack(deck.hand[PLAYERS.PLAYER]);
	 		deck.blackJack[PLAYERS.DEALER] = _isBlackJack(deck.hand[PLAYERS.DEALER]);
	 		DeckStore.emitChange();
	 		break;
	 	
	 	case actionTypes.PLAYER_HIT:
			deck.hand[PLAYERS.PLAYER] = [...deck.hand[PLAYERS.PLAYER], ...(_dealCards(1))];
			deck.isBust[PLAYERS.PLAYER] = _isBust(deck.hand[PLAYERS.PLAYER]);
			DeckStore.emitChange();
			break;
 		
 		case actionTypes.PLAYER_STICK:
			deck.dealerHiddenCard = null;
			DeckStore.emitChange();
 			break;

 		case actionTypes.DEALER_IS_IN_PLAY:
			deck.hand[PLAYERS.DEALER] = _dealerHit(deck.hand[PLAYERS.DEALER]);
			deck.isBust[PLAYERS.DEALER] = _isBust(deck.hand[PLAYERS.DEALER]);
			DeckStore.emitChange();
 			break;	
	}
	return true;
};

/*++++++++++++++++++++
+ PUBLIC GETTERS
+++++++++++++++++++++*/

/**
 * getAllDeck.
 * @return {object} deck store state 
 */
const getAllDeck = () => deck;

/**
 * hasBlackJack.
 * @param {string} player - whose hand to check for Black Jack
 * @return {boolean} Whether hand is a Black Jack
 */
const hasBlackJack = (player) => deck.blackJack[player];

/**
 * isBust.
 * @param {string} player - whose hand to check for whether it's bust
 * @return {boolean} Whether hand is bust
 */
const isBust = (player) => deck.isBust[player];

/**
 * getHandValue.
 * @param {string} player - wwhose hand value to get
 * @param {aceValue} aceValue - whether to treat ace as high or low value
 * @return {number} Hand value
 */
const getHandValue = (player, aceValue) => _getHandValue(deck.hand[player], aceValue);

/**
 * getStrongestHandValue.
 * @param {string} player - whose hand value to get
 * @return {number} Strongest possible hand value
 */
const getStrongestHandValue = (player) => _getStrongestHandValue(deck.hand[player]);

const DeckStore = Object.assign(new EventEmitter(), {
	emitChange() {
    	this.emit(CHANGE_EVENT);
  	},
  	/**
   	* @param {function} callback
   	*/
  	addChangeListener(callback) {
    	this.on(CHANGE_EVENT, callback);
  	},
  	/**
   	* @param {function} callback
   	*/
  	removeChangeListener(callback) {
    	this.removeListener(CHANGE_EVENT, callback);
  	},
});

DeckStore.getAllDeck = getAllDeck;
DeckStore.hasBlackJack = hasBlackJack;
DeckStore.isBust = isBust;
DeckStore.getHandValue = getHandValue;
DeckStore.getStrongestHandValue = getStrongestHandValue;
DeckStore.dispatchToken = AppDispatcher.register(registeredCallback);

export default DeckStore;
