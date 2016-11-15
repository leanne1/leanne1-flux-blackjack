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
        	<section className='scoreboard'>
                { gameStatus === GAME.STATUS.PLAYER_WINS && 
        			<div className='alert alert-success'>
                        <strong>You win!</strong> Congratulations
                    </div>    
        		}
                { gameStatus === GAME.STATUS.PLAYER_BUST && 
                    <div className='alert alert-danger'>
                        <strong>Dealer wins!</strong> You went bust
                    </div>    
                }
                { gameStatus === GAME.STATUS.DEALER_WINS && 
                    <div className='alert alert-danger'>
                        <strong>Dealer wins!</strong> Dealer has stronger hand
                    </div>
                }
        		{ gameStatus === GAME.STATUS.DRAW && 
        			<div className='alert alert-info'>
                        <strong>It&apos;s a draw!</strong> Better luck next time
                    </div>    
                }
           </section>
		);
    }
}
