import React, { Component, PropTypes } from 'react';
import Hand from './Hand';

export default class Player extends Component { 
    static propTypes = {
        cards: PropTypes.array,
    }
    render() {
        const {
            cards,
        } = this.props;
        
        return (
        	<div>
        		<h2>Player</h2>
        		<Hand
                    cards={cards} />
        	</div>
    	);
    }
}