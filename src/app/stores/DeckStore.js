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

/**
 * Create the card deck.
 * @return {array} card deck
 */
export const createCardDeck = () => {
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
export const newDeck = (deck) => {
	const newDeck = createCardDeck();
	deck.undealtCards = shuffle(newDeck);
};

/**
 * Deal card/s from the start of the deck. Mutates deck.undealtCards length
 * @param {number} n - number of cards to take
 * @param {object} _deck - deck to mutate
 * @return {array} card/s removed from deck
 */
export const dealCards = (n = 0, _deck = deck) => {
	return _deck.undealtCards.splice(0, n);
};

/**
 * Check whether the given hand is a BlackJack.
 * @param {array} hand - hand to check
 * @return {boolean} whether the hand is a Black Jack
 */
export const isBlackJack = (hand) => {
	if (hand.length > 2) {
		return false;
	}
	const handValue = getHandValue(hand);
	const hasAce = hand[0].faceValue === 1 || hand[1].faceValue === 1;
	return hasAce && handValue === 11;
};

/**
 * Get total hand value
 * @param {array} hand - hand whose value to calculate
 * @param {string} aceValue - low treats aces as 1; high treats aces as 11
 * @return {number} total value of the hand
 */
export const getHandValue = (hand, aceValue = CARDS.ACE_LOW) => {
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
export const isBust = (hand) => {
	return getHandValue(hand) > GAME_PARAMETERS.BLACKJACK_VALUE;
};

/**
 * Dealer hit. Called recursively until dealer hand >= 17.
 * For simplicity, the dealer treats all aces as high. This could be corrected
 * with additional logic around whether to treat an ace as high or low dependent
 * on the values of the other cards in the hand
 * @param {array} hand - dealer's current hand
 * @return {array} hand - the dealer's next hand
 */
export const dealerHit = (hand) => {
	const dealerHandValue = getHandValue(hand, CARDS.ACE_HIGH);
	const dealerMustHit = dealerHandValue < GAME_PARAMETERS.DEALER_STICK_VALUE;
	if (dealerMustHit) {
		return dealerHit([...hand, ...(dealCards(1))]);
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
export const getStrongestHandValue = (hand) => {
	const lowHand = getHandValue(hand);
	const highHand = getHandValue(hand, CARDS.ACE_HIGH);
	return highHand > GAME_PARAMETERS.BLACKJACK_VALUE ? lowHand : highHand;
};


const DeckStore = Object.assign(new EventEmitter(), {
	getAllDeck() {
		return deck;
	},
	hasBlackJack(player) {
		return deck.blackJack[player];
	},
	isBust(player) {
		return deck.isBust[player];
	},
	getHandValue(player, aceValue) {
		return getHandValue(deck.hand[player], aceValue);
	},
	getStrongestHandValue(player) {
		return getStrongestHandValue(deck.hand[player]);
	},
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
  	dispatchToken: AppDispatcher.register(({ action }) => {
		switch(action.actionType) {
  		 	case actionTypes.DECK_DEAL:
  		 		newDeck(deck);
  		 		deck.hand[PLAYERS.DEALER] = dealCards(2);
  		 		deck.hand[PLAYERS.PLAYER] = dealCards(2);
  		 		deck.dealerHiddenCard = 0;
  		 		deck.blackJack[PLAYERS.PLAYER] = isBlackJack(deck.hand[PLAYERS.PLAYER]);
  		 		deck.blackJack[PLAYERS.DEALER] = isBlackJack(deck.hand[PLAYERS.DEALER]);
  		 		console.log('deck', deck)
  		 		DeckStore.emitChange();
  		 		break;
  		 	
  		 	case actionTypes.PLAYER_HIT:
	 			deck.hand[PLAYERS.PLAYER] = [...deck.hand[PLAYERS.PLAYER], ...(dealCards(1))];
	 			deck.isBust[PLAYERS.PLAYER] = isBust(deck.hand[PLAYERS.PLAYER]);
	 			console.log('deck', deck)
	 			DeckStore.emitChange();
	 			break;
	 		
	 		case actionTypes.PLAYER_STICK:
				deck.dealerHiddenCard = null;
				console.log('deck', deck)
	 			DeckStore.emitChange();
	 			break;

	 		case actionTypes.DEALER_IS_IN_PLAY:
				deck.hand[PLAYERS.DEALER] = dealerHit(deck.hand[PLAYERS.DEALER]);
				deck.isBust[PLAYERS.DEALER] = isBust(deck.hand[PLAYERS.DEALER]);

				console.log('deck', deck)
	 			DeckStore.emitChange();
	 			break;	
  		 }
  		 return true;
  	}),
});

export default DeckStore;
