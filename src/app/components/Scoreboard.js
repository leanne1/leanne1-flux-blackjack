import React, { Component, PropTypes } from 'react';
import { GAME, PLAYERS } from '../constants/config';

export default class Scoreboard extends Component { 
    static propTypes = {
    	gameStatus: PropTypes.string.isRequired,
    	winner: PropTypes.string,
    }
    componentDidMount() {

    }
    render() {
        const { gameStatus } = this.props;
        return (
        	<section>
        		{ gameStatus === GAME.STATUS.COMPLETE && 
        			<p>{PLAYERS[winner]} wins!</p>
        		}
        		{ gameStatus === GAME.STATUS.DRAW && 
        			<p>It's a draw!</p>
        		}
    		</section>
		);
    }
}