import React, { Component, PropTypes } from 'react';
import Hand from './Hand';

export default class Dealer extends Component { 
    static propTypes = {
    }
    render() {
        return (
        	<div>
        		<h2>Dealer</h2>
        		 
                <Hand
                    cards={[
                        { suit: 'clubs', faceValue: 6 },
                        { suit: 'spades', faceValue: 12 }
                    ]} />
        	</div>
    	);
    }
}