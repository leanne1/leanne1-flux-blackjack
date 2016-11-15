import EventEmitter from 'event-emitter';
import { knuthShuffle as shuffle } from 'knuth-shuffle';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { GAME, PLAYERS } from '../constants/config';
import DeckStore from './DeckStore';
import actionTypes from '../constants/actionTypes'

const CHANGE_EVENT = 'change';

/**
 * Declare store shape.
 */
const game = {
	status: null,
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
		 	game.status = GAME.STATUS.IN_PROGRESS;
	 		GameStore.emitChange();
	 		break;
		
		case actionTypes.PLAYER_HIT:
			AppDispatcher.waitFor([
				DeckStore.dispatchToken,
			]);
			if (DeckStore.isBust(PLAYERS.PLAYER)) {
				game.status = GAME.STATUS.PLAYER_BUST;
			}
			GameStore.emitChange();
			break;

	 	case actionTypes.PLAYER_STICK:
	 		AppDispatcher.waitFor([
				DeckStore.dispatchToken,
			]);
			const dealerHasBlackJack = DeckStore.hasBlackJack(PLAYERS.DEALER);
			const playerHasBlackJack = DeckStore.hasBlackJack(PLAYERS.PLAYER);
	 		
	 		/* Player sticks, check if the game has concluded */
	 		if (dealerHasBlackJack && playerHasBlackJack) {
				game.status = GAME.STATUS.DRAW;
			} else if (playerHasBlackJack) {
				game.status = GAME.STATUS.PLAYER_WINS;
			} else if (dealerHasBlackJack) {
				game.status = GAME.STATUS.DEALER_WINS;
			}
	 		
	 		/* Game has not concluded...
	 			This feels hacky. I now want to trigger an action on the DeckStore to handle dealer play.
	 			However, I cannot dispatch an action from here and I cannot have DeckStore waitFor GameStore's
	 			update on the game status because that would create a circularity. I could create a third store, 
	 			just for this situation, or I can do this: set a state in the GameStore that triggers the App view 
	 			to trigger a new action handing play over to the dealer.... 
	 		*/
	 		if (game.status === GAME.STATUS.IN_PROGRESS) {
	 			game.status = GAME.STATUS.DEALER_IS_IN_PLAY;
	 		}
	 		GameStore.emitChange();
	 		break;

		case actionTypes.DEALER_IS_IN_PLAY:
			AppDispatcher.waitFor([
				DeckStore.dispatchToken,
			]);
			const playerStrongestHandValue = DeckStore.getStrongestHandValue(PLAYERS.PLAYER);
			const dealerStrongestHandValue = DeckStore.getStrongestHandValue(PLAYERS.DEALER);
			
			/* Dealer has taken required hits, check if the game has concluded */
			if (DeckStore.isBust(PLAYERS.DEALER)) {
				game.status = GAME.STATUS.PLAYER_WINS;
			} else if (playerStrongestHandValue > dealerStrongestHandValue) {
				game.status = GAME.STATUS.PLAYER_WINS;
			} else if (playerStrongestHandValue < dealerStrongestHandValue) {
				game.status = GAME.STATUS.DEALER_WINS;
			} else {
				game.status = GAME.STATUS.DRAW;
			}
			GameStore.emitChange();
			break;	
	}
	return true;
};

/*++++++++++++++++++++
+ PUBLIC GETTERS
+++++++++++++++++++++*/

/**
 * getAllGameState.
 * @return {object} Game store state
 */
const getAllGameState = () => game;

const GameStore = Object.assign(new EventEmitter(), {
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

GameStore.getAllGameState = getAllGameState;
GameStore.dispatchToken = AppDispatcher.register(registeredCallback);

export default GameStore;
