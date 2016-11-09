import React, { Component, PropTypes } from 'react';
import Hand from './Hand';
import Scoreboard from './Scoreboard';
import Controls from './Controls';

export default class App extends Component { 
    static propTypes = {

    }
    componentDidMount() {

    }
    onHitClick() {
        console.log('Player chose hit')
    }
    onStickClick() {
        console.log('Player chose stick')
    }
    render() {
        return (
        	<main>
        		<Scoreboard 
                    gameStatus='' />
                
                <Hand
                    owner='dealer' />
                
                <Hand
                    owner='player' />
                
                <Controls 
                    onHitClick={::this.onHitClick}
                    onStickClick={::this.onStickClick} />
        	</main>
    	);
    }
}