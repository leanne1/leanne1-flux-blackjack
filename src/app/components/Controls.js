import React, { Component, PropTypes } from 'react';

export default class Controls extends Component { 
    static propTypes = {
    	onHitClick: PropTypes.func.isRequired,
    	onStickClick: PropTypes.func.isRequired,
    }
    render() {
        const { onHitClick, onStickClick } = this.props;
        return (
        	<menu>
        		<button
        			onClick={onHitClick}>
        			Hit
    			</button>
        		<button
        			onClick={onStickClick}>
        			Stick
    			</button>
        	</menu>
    	);
    }
}