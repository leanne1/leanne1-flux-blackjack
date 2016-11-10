import AppDispatcher from '../dispatcher/AppDispatcher';
import actionTypes from '../constants/actionTypes'

export default {
	/**
	* Create and shuffle a new deck then deal cards. Dispatched at start of new game.
   	*/
	deal() {
		AppDispatcher.handleViewAction({
      		actionType: actionTypes.DECK_DEAL,
      	});
	}
};
