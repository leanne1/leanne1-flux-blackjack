import EventEmitter from 'event-emitter';
import { knuthShuffle as shuffle } from 'knuth-shuffle';
import { PLAYERS } from '../constants/config';
import AppDispatcher from '../dispatcher/AppDispatcher';
import actionTypes from '../constants/actionTypes'

const CHANGE_EVENT = 'change';

/**
 * Declare store shape.
 */
const deck = {
	undealtCards: null,
	playerHand: null,
	dealerHand: null,
	dealerHiddenCard: null,
	blackJack: {},
};

/**
 * Create the card deck.
 */
export const createCardDeck = () => {
	const cardDeck = []; 
	const suits = ['clubs', 'hearts', 'spades', 'diamonds'];
	suits.forEach(suit => {
		let count = 13;
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
 * Shuffle the card deck.
 */
export const shuffleDeck = (deck) => {
	shuffle(deck);
};

/**
 * Create a new card deck, shuffle it then cache it in the store.
 */
export const newDeck = () => {
	const newDeck = createCardDeck();
	deck.undealtCards = shuffle(newDeck);
};

/**
 * Deal card/s from the end of the deck. Mutates deck.undealtCards length
 * @param {number} count - number of cards to take
 * @return {array} card/s removed from deck
 */
export const dealCards = (count) => {
	return deck.undealtCards.splice(0, count);
};

/**
 * Check whether the given hand is a BlackJack.
 * @param {array} hand - hand to check
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
 * @param {string} ace - low treats aces as 1; high treats aces as 11
 */
export const getHandValue = (hand, ace = 'low') => {
	return hand.reduce((prev, curr) => { 
		const currentValue = curr.value === 1 ? 
			ace === 'high' ? 
				11 : 1 : curr.value;
		return prev + currentValue;
	}, 0);
};

/**
 * Check whether a given hand is bust.
 */
export const isBust = (hand) => {
	// Always use the lower value of an ace
	const handValue = hand.reduce((prev, curr) => { 
		return prev += curr.value;
	}, 0);
};

const DeckStore = Object.assign(new EventEmitter(), {
	getAllDeck() {
		return deck;
	},
	hasBlackJack(player) {
		return deck.blackJack[player];
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
  		 		newDeck();
  		 		deck.dealerHand = dealCards(2);
  		 		deck.playerHand = dealCards(2);
  		 		deck.dealerHiddenCard = 0;
  		 		deck.blackJack.PLAYER = isBlackJack(deck.playerHand);
  		 		deck.blackJack.DEALER = isBlackJack(deck.dealerHand);
  		 		console.log('deck', deck)
  		 		DeckStore.emitChange();
  		 		break;
  		 	case actionTypes.PLAYER_HIT: 
	 			deck.playerHand = [...deck.playerHand, ...(dealCards(1))];
	 			DeckStore.emitChange();
  		 }
  		 return true;
  	}),
});

export default DeckStore;
