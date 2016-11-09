import React, { Component, PropTypes } from 'react';

export default class Card extends Component { 
    static propTypes = {
    	suit: PropTypes.string.isRequired,
    	faceValue: PropTypes.number.isRequired,
    }
    render() {
        const { suit, faceValue } = this.props;
        return (
        	<div>
        		{ suit }
        		{ faceValue }
        	</div>
    	);
    }
}