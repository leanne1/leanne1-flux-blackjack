import React, { Component, PropTypes } from 'react';

export default class Card extends Component { 
    static propTypes = {
    	suit: PropTypes.string.isRequired,
    	faceValue: PropTypes.number.isRequired,
        isHidden: PropTypes.bool,
    }
    render() {
        const {
            suit,
            faceValue,
            isHidden,
        } = this.props;
        
        return (
            <div className={isHidden ? 'card-hidden' : ''}>
                { !isHidden &&
                    <span>
                        { suit }
                        { faceValue }
                    </span>
                }
            </div>
    	);
    }
}
