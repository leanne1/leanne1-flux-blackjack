import React, { Component, PropTypes } from 'react';
import { GAME } from '../constants/config'

export default class Controls extends Component { 
    static propTypes = {
    	gameStatus: PropTypes.string,
        onHitClick: PropTypes.func.isRequired,
    	onStickClick: PropTypes.func.isRequired,
        onNewGameClick: PropTypes.func.isRequired,
    }
    render() {
        const {
            gameStatus,
            onHitClick,
            onStickClick,
            onNewGameClick
        } = this.props;
        
        const isGameInProgress = gameStatus === GAME.STATUS.IN_PROGRESS;

        return (
        	<menu>
        		
                <button
        			disabled={!isGameInProgress}
                    onClick={onHitClick}>
        			Hit
    			</button>
        		
                <button
        			disabled={!isGameInProgress}
                    onClick={onStickClick}>
        			Stick
    			</button>
                
                <button
                    onClick={onNewGameClick}>
                    New Game
                </button>    
        	
            </menu>
    	);
    }
}