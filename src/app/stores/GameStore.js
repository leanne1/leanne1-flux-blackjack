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
	 		 	AppDispatcher.waitFor([
			    	DeckStore.dispatchToken,
				]);

	 		 	// Check whether player/dealer have opening black jack
  		 		if (DeckStore.hasBlackJack(PLAYERS.PLAYER)) {
  		 			if (DeckStore.hasBlackJack(PLAYERS.DEALER)) {
						game.status = GAME.STATUS.DRAW;
  		 			} else {
  		 				game.status = GAME.STATUS.PLAYER_WINS;	
  		 			}
  		 		} else {
  		 			game.status = GAME.STATUS.IN_PROGRESS;
  		 		}
  		 		GameStore.emitChange();
  		 		break;
  		 	case actionTypes.PLAYER_HIT:
  		 		AppDispatcher.waitFor([
			    	DeckStore.dispatchToken,
				]);

				
  		 }

  		 return true;
  	}),
});

export default GameStore;
