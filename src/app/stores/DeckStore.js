import EventEmitter from 'event-emitter';
import { knuthShuffle as shuffle } from 'knuth-shuffle';
import AppDispatcher from '../dispatcher/AppDispatcher';
import actionTypes from '../constants/actionTypes'

const CHANGE_EVENT = 'change';

const deck = {
	cards: null,
};

/**
 * Create the card deck.
 */
const createCardDeck = () => {
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
const shuffleDeck = (deck) => {
	shuffle(deck);
};

/**
 * Create a new card deck, shuffle it then cache it in the store.
 */
const newDeck = () => {
	const newDeck = createCardDeck();
	deck.cards = shuffle(newDeck);
};

/**
 * Deal card/s from the end of the deck. Updates deck.cards length
 * @param {number} count - number of cards to take
 * @return {array} card/s removed from deck
 */
const dealCards = (count) => {
	const nextDeck = [...deck.cards];
	const dealtCards = nextDeck.splice(0, count);
	deck.cards = nextDeck;
	return dealtCards;
};

const DeckStore = Object.assign(new EventEmitter(), {
	getAllDeck() {
		return deck;
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

  	dispatcherIndex: AppDispatcher.register(({ action }) => {
  		
		switch(action.actionType) {
  		 	case actionTypes.DECK_DEAL: 
  		 		newDeck();
  		 		deck.dealerHand = dealCards(2);
  		 		deck.playerHand = dealCards(2);
  		 		console.log('deck', deck)
  		 		DeckStore.emitChange();
  		 		break;
  		 }

  		 return true;
  	}),
});

export default DeckStore;
