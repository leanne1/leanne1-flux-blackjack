import React, { Component, PropTypes } from 'react';
import { PLAYERS } from '../constants/config';
import DeckStore from '../stores/DeckStore';
import Hand from '../components/Hand';

export default class Player extends Component { 
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
    render() {
        const { hand = {} } = this.state;
        const playerHand = hand[PLAYERS.PLAYER];
        
        return (
        	<div>
        		<h2 className='player-name'>Player</h2>
        		<Hand
                    cards={playerHand} />
        	</div>
    	);
    }
}
