import AppDispatcher from '../dispatcher/AppDispatcher';
import actionTypes from '../constants/actionTypes'

export default {
	/**
	* Dealer is now in play and must hit or stand.
   	*/
	isInPlay() {
		AppDispatcher.handleViewAction({
      		actionType: actionTypes.DEALER_IS_IN_PLAY,
      	});
	},
};
