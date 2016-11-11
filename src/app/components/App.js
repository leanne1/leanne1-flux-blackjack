import React, { Component, PropTypes } from 'react';
import Dealer from './Dealer';
import Player from './Player';
import Scoreboard from './Scoreboard';
import Controls from './Controls';
import DeckActions from '../actions/DeckActions';
import PlayerActions from '../actions/PlayerActions';
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
        this.setState(this.getGameState());
    }
    onHitClick() {
        console.log('Player chose hit')
        PlayerActions.hit();
    }
    onStickClick() {
        console.log('Player chose stick')
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