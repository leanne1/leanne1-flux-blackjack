import React, { Component, PropTypes } from 'react';
import Card from './Card';

export default class Hand extends Component { 
    static propTypes = {
    	owner: PropTypes.string.isRequired,
    }
    componentWillMount() {
    	this.setState({
    		cards: [
            	{ suit: 'clubs', faceValue: 10 },
            	{ suit: 'spades', faceValue: 3 }
        	]
    	});
    }
    getCards() {
    	const { cards } = this.state;
    	return cards.map((card, i) => {
    		return <Card 
    					key={i}
    					suit={card.suit}
    					faceValue={card.faceValue} />
    	});
    }
    render() {
        const { owner } = this.props;
        const cards = ::this.getCards();
        
        return (
        	<div>
        		<h2>{owner}</h2>
        		{ cards }
        	</div>
    	);
    }
}