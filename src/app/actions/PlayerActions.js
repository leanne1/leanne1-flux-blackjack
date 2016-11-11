import AppDispatcher from '../dispatcher/AppDispatcher';
import actionTypes from '../constants/actionTypes'

export default {
	/**
	* Player takes another card.
   	*/
	hit() {
		AppDispatcher.handleViewAction({
      		actionType: actionTypes.PLAYER_HIT,
      	});
	}
};
