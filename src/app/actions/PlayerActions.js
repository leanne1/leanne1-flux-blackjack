import AppDispatcher from '../dispatcher/AppDispatcher';
import actionTypes from '../constants/actionTypes'

export default {
	/**
	* Player hits (takes another card).
   	*/
	hit() {
		AppDispatcher.handleViewAction({
      		actionType: actionTypes.PLAYER_HIT,
      	});
	},
	/**
	* Player sticks.
   	*/
	stick() {
		AppDispatcher.handleViewAction({
	  		actionType: actionTypes.PLAYER_STICK,
	  	});
	},	
};
