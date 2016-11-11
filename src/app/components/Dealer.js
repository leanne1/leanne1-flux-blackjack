import React, { Component, PropTypes } from 'react';
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
            dealerHand,
            dealerHiddenCard,
        } = this.state;

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