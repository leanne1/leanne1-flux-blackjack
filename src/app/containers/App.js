import React, { Component, PropTypes } from 'react';
import { GAME } from '../constants/config';
import Dealer from './Dealer';
import Player from './Player';
import Scoreboard from '../components/Scoreboard';
import Controls from '../components/Controls';
import DeckActions from '../actions/DeckActions';
import PlayerActions from '../actions/PlayerActions';
import DealerActions from '../actions/DealerActions';
import GameStore from '../stores/GameStore';

export default class App extends Component { 
    static propTypes = {
    }
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        GameStore.addChangeListener(::this.onGameStoreChange);
    }
    componentWillUnmount() {
        GameStore.removeChangeListener(::this.onGameStoreChange);
    }
    getGameState() {
        return GameStore.getAllGameState();
    }
    onGameStoreChange() {
        const gameState = this.getGameState();
        this.setState(gameState);
        
        // Hand play over to dealer
        if (gameState.status === GAME.STATUS.DEALER_IS_IN_PLAY) {
            window.setTimeout(() => {
                DealerActions.isInPlay();   
            }, 2000);
            
        }
    }
    onHitClick() {
        PlayerActions.hit();
    }
    onStickClick() {
        PlayerActions.stick();
    }
    onNewGameClick() {
        DeckActions.deal();
    }
    render() {
        const {
            status,
        } = this.state;
        
        return (
        	<main>
        		<Scoreboard 
                    gameStatus={status} />
                
                <Dealer />

                <Player />
                
                <Controls 
                    gameStatus={status}
                    onHitClick={::this.onHitClick}
                    onStickClick={::this.onStickClick}
                    onNewGameClick={::this.onNewGameClick} />
        	</main>
    	);
    }
}
