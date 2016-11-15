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
        	<menu className='control-panel'>

                <button
        			className='btn btn-info'
                    disabled={!isGameInProgress}
                    onClick={onHitClick}>
        			Hit
    			</button>
        		
                <button
        			className='btn btn-info'
                    disabled={!isGameInProgress}
                    onClick={onStickClick}>
        			Stick
    			</button>
                
                <button
                    className='btn btn-warning'
                    disabled={isGameInProgress}
                    onClick={onNewGameClick}>
                    New Game
                </button>    
        	
            </menu>
    	);
    }
}