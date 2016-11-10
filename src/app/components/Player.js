import React, { Component, PropTypes } from 'react';
import Hand from './Hand';

export default class Player extends Component { 
    static propTypes = {
    }
    render() {
        return (
        	<div>
        		<h2>Player</h2>
        		<Hand
                    cards={[
                        { suit: 'clubs', faceValue: 10 },
                        { suit: 'spades', faceValue: 3 }
                    ]} />
        	</div>
    	);
    }
}