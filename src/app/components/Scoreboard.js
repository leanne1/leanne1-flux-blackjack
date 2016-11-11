import React, { Component, PropTypes } from 'react';
import { GAME, PLAYERS } from '../constants/config';

export default class Scoreboard extends Component { 
    static propTypes = {
    	gameStatus: PropTypes.string,
    	winner: PropTypes.string,
    }
    componentDidMount() {

    }
    render() {
        const {
            gameStatus
        } = this.props;
        
        return (
        	<section>
        		{ gameStatus === GAME.STATUS.PLAYER_WINS && 
        			<p>You win!</p>
        		}
                { gameStatus === GAME.STATUS.PLAYER_BUST && 
                    <p>You went bust! Dealer wins!</p>
                }
                { gameStatus === GAME.STATUS.DEALER_WINS && 
                    <p>Dealer wins!</p>
                }
        		{ gameStatus === GAME.STATUS.DRAW && 
        			<p>It's a draw!</p>
                }
    		</section>
		);
    }
}
