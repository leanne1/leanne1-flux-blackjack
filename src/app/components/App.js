import React, { Component, PropTypes } from 'react';
import Dealer from './Dealer';
import Player from './Player';
import Scoreboard from './Scoreboard';
import Controls from './Controls';
import DeckActions from '../actions/DeckActions';
import DeckStore from '../stores/DeckStore';

export default class App extends Component { 
    static propTypes = {
    }
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        DeckStore.addChangeListener(::this.onDeckStoreChange);
    }
    componentWillUnmount() {
        DeckStore.removeChangeListener(::this.onDeckStoreChange);
    }
    getDeckState() {
        return DeckStore.getAllDeck();
    }
    onDeckStoreChange() {
        this.setState(this.getDeckState());
    }
    onHitClick() {
        console.log('Player chose hit')
    }
    onStickClick() {
        console.log('Player chose stick')
    }
    onNewGameClick() {
        DeckActions.deal();
    }
    render() {
        const {
            dealerHand,
            playerHand,
        } = this.state;
        
        return (
        	<main>
        		<Scoreboard 
                    gameStatus='' />
                
                <Dealer 
                    cards={dealerHand} />

                <Player
                    cards={playerHand} />
                
                <Controls 
                    onHitClick={::this.onHitClick}
                    onStickClick={::this.onStickClick}
                    onNewGameClick={::this.onNewGameClick} />
        	</main>
    	);
    }
}