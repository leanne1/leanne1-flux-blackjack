import React, { Component, PropTypes } from 'react';
import { PLAYERS } from '../constants/config';
import DeckStore from '../stores/DeckStore';
import Hand from './Hand';

export default class Dealer extends Component { 
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
            hand = {},
            dealerHiddenCard
        } = this.state;
        const dealerHand = hand[PLAYERS.DEALER];
       
        return (
        	<div>
        		<h2>Dealer</h2>
                <Hand
                    hideCard={dealerHiddenCard}
                    cards={dealerHand} />
        	</div>
    	);
    }
}