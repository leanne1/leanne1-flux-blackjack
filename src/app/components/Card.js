import React, { Component, PropTypes } from 'react';
import { CARD_FACE_VALUES } from '../constants/config';

export default class Card extends Component { 
    static propTypes = {
    	suit: PropTypes.string.isRequired,
    	faceValue: PropTypes.number.isRequired,
        isHidden: PropTypes.bool,
        index: PropTypes.number.isRequired,
    };
    render() {
        const {
            suit,
            faceValue,
            isHidden,
	        index,
        } = this.props;
        
        return (
            <div className={`card card-${index} ${isHidden ? 'card-hidden' : ''}`}>
                { !isHidden &&
                    <span className={`card-suit-${suit} card-face-${CARD_FACE_VALUES[faceValue]}`}>
	                </span>
                }
            </div>
    	);
    }
};

