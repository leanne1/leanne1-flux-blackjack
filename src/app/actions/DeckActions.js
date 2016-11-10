import AppDispatcher from '../dispatcher/AppDispatcher';
import actionTypes from '../constants/actionTypes'

export default {
	/**
	* Create the card deck.
   	*/
	create() {
		AppDispatcher.handleViewAction({
      		actionType: actionTypes.DECK_CREATE,
      	});
	}
};
