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

const GameStore = Object.assign(new EventEmitter(), {
	getAllGameState() {
		return game;
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
  		 		
  		 		// Check if the game has concluded
  		 		if (dealerHasBlackJack && playerHasBlackJack) {
 					game.status = GAME.STATUS.DRAW;
 				} else if (playerHasBlackJack) {
					game.status = GAME.STATUS.PLAYER_WINS;
 				} else if (dealerHasBlackJack) {
 					game.status = GAME.STATUS.DEALER_WINS;
 				}
  		 		
  		 		// Game has not concluded...
  		 		// This feels hacky. I now want to trigger an action on the DeckStore to handle dealer play.
  		 		// However, I cannot dispatch an action from here and I cannot have DeckStore waitFor GameStore's
  		 		// update on the game status because that would create a circularity. I could create a third store, 
  		 		// just for this situation, or I can do this: set a state in the GameStore that triggers the App view 
  		 		// to trigger a new action handing play over to the dealer....
  		 		if (game.status === GAME.STATUS.IN_PROGRESS) {
  		 			game.status = GAME.STATUS.DEALER_IS_IN_PLAY;
  		 		}
  		 		GameStore.emitChange();
  		 		break;

	 		case actionTypes.DEALER_IS_IN_PLAY:
				AppDispatcher.waitFor([
	    			DeckStore.dispatchToken,
				]);
				// TODO: player hand could use either ace value here - currently only uses 1
				const playerHandValue = DeckStore.getPlayerHandValue();
				const dealerHandValue = DeckStore.getDealerHandValue();

				// TODO: rewrite as a switch statement
				if (DeckStore.isBust(PLAYERS.DEALER)) {
					game.status = GAME.STATUS.PLAYER_WINS;
				} else if (playerHandValue > dealerHandValue) {
					game.status = GAME.STATUS.PLAYER_WINS;
				} else if (playerHandValue < dealerHandValue) {
					game.status = GAME.STATUS.DEALER_WINS;
				} else {
					game.status = GAME.STATUS.DRAW;
				}
				GameStore.emitChange();
	 			break;	
  		}
  		return true;
  	}),
});

export default GameStore;
