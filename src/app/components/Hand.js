import React, { Component, PropTypes } from 'react';
import Card from './Card';

export default class Hand extends Component { 
    static propTypes = {
    	cards: PropTypes.array.isRequired,
    }
    componentWillMount() {
    	
    }
    getCards(owner) {
    	const { cards } = this.props;
    	return cards.map((card, i) => {
    		return <Card 
    					key={i}
    					suit={card.suit}
    					faceValue={card.faceValue} />
    	});
    }
    render() {
        const cards = ::this.getCards();
        
        return (
        	<div>
        		{ cards }
        	</div>
    	);
    }
}