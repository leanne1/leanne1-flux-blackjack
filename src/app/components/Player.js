import React, { Component, PropTypes } from 'react';
import DeckStore from '../stores/DeckStore';
import Hand from './Hand';

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
        const {
            playerHand,
        } = this.state;
        
        return (
        	<div>
        		<h2>Player</h2>
        		<Hand
                    cards={playerHand} />
        	</div>
    	);
    }
}