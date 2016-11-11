import React, { Component, PropTypes } from 'react';
import Card from './Card';

export default class Hand extends Component { 
    static propTypes = {
    	hideCard: PropTypes.number, 
        cards: PropTypes.array,
    }
    static defaultProps = {
        cards: [],
    }
    componentWillMount() {
    	
    }
    getCards(owner) {
    	const { 
            cards,
            hideCard,
        } = this.props;
    	
        return cards.map((card, i) => {
    		return <Card 
    					key={i}
    					isHidden={i === hideCard}
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