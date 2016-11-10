import React, { Component, PropTypes } from 'react';
import Dealer from './Dealer';
import Player from './Player';
import Scoreboard from './Scoreboard';
import Controls from './Controls';
import DeckActions from '../actions/DeckActions';
import DeckStore from '../stores/DeckStore';

export default class App extends Component { 
    static propTypes = {

    }
    componentWillMount() {
        DeckActions.create();
    }
    componentDidMount() {
    }
    onDeckStoreChange() {
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
                
                <Dealer />

                <Player />
                
                <Controls 
                    onHitClick={::this.onHitClick}
                    onStickClick={::this.onStickClick} />
        	</main>
    	);
    }
}