import EventEmitter from 'event-emitter';
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
 * Take cards from the end of the deck.
 * @param {number} count - number of cards to take
 */
const takeCards = (count) => {
	deck.lastRemovedCards = deck.cards.splice(0, count);
};

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

  	dispatcherIndex: AppDispatcher.register(({action}) => {
  		
		switch(action.actionType) {
  		 	case actionTypes.DECK_CREATE: 
  		 		const newDeck = createCardDeck(); // TODOO: shuffle
  		 		deck.cards = newDeck;
  		 		console.warn('Card Deck:', deck.cards)
  		 		DeckStore.emitChange();
  		 		break;
  		 }

  		 return true;
  	}),
});

export default DeckStore;
