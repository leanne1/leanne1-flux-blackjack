import expect from 'expect';
import { __RewireAPI__ as GameStoreRewireAPI } from '../../src/app/stores/GameStore';
import * as GameStore from '../../src/app/stores/GameStore';
import { CARDS, PLAYERS, GAME } from '../../src/app/constants/config';

describe('GameStore', () => {
    describe('Store state updates', () => {
    	let registeredCallback, getAllGameState, AppDispatcher, DeckStore, game, initialDeckStoreState;
        beforeEach(() => {
            registeredCallback = GameStoreRewireAPI.__GetDependency__('registeredCallback');
            getAllGameState = GameStoreRewireAPI.__GetDependency__('getAllGameState');
            AppDispatcher = GameStoreRewireAPI.__Rewire__('AppDispatcher', {
            	waitFor: () => {},
            });
            game = GameStoreRewireAPI.__set__
            initialDeckStoreState = {
            	undealtCards: null,
				dealerHiddenCard: null,
				hand: {
					[PLAYERS.PLAYER]: [],
					[PLAYERS.DEALER]: [],
				},
				blackJack: {
					[PLAYERS.PLAYER]: null,
					[PLAYERS.DEALER]: null,
				},
				isBust: {
					[PLAYERS.PLAYER]: false,
					[PLAYERS.DEALER]: null,
				},
            }
            DeckStore = GameStoreRewireAPI.__Rewire__('DeckStore.deck', initialDeckStoreState);
        });
        afterEach(() => {
        	GameStoreRewireAPI.__ResetDependency__('AppDispatcher');
        	GameStoreRewireAPI.__ResetDependency__('DeckStore');
        });

        it('should not update the store when an unknown action is dispatched', () => {
            registeredCallback({
                action: {
                    actionType: 'UNKNOWN_ACTION',
                }
            });
            const actual = getAllGameState();
            const initialGameState = {
                status: null
            };
            expect(actual).toEqual(initialGameState);
        });
       	
       	context('DECK_DEAL action is dispatched', () => {
       		it('should set the game status to in progress', () => {
	        	registeredCallback({
	                action: {
	                    actionType: 'DECK_DEAL',
	                }
	            });
	            const game = getAllGameState();
	            expect(game.status).toBe(GAME.STATUS.IN_PROGRESS);
	        });
       	});
        
		context('PLAYER_HIT action is dispatched', () => {
			context('when the player is not bust', () => {
 				it('should set the game status to in progress', () => {
		        	GameStoreRewireAPI.__Rewire__('DeckStore', {
	        			isBust: () => false,
	        		});
		        	registeredCallback({
		                action: {
		                    actionType: 'PLAYER_HIT',
		                }
		            });
		            const game = getAllGameState();
		            expect(game.status).toBe(GAME.STATUS.IN_PROGRESS);
		        });
	        });
	        context('when the player is bust', () => {
				it('should set the game status to player bust', () => {
		        	GameStoreRewireAPI.__Rewire__('DeckStore', {
		        		isBust: () => true,
		        	});
		        	registeredCallback({
		                action: {
		                    actionType: 'PLAYER_HIT',
		                }
		            });
		            const game = getAllGameState();
		            expect(game.status).toBe(GAME.STATUS.PLAYER_BUST);
		            
		        });
	        });
		});

		context('PLAYER_STICK action is dispatched', () => {
			context('when the player and dealer each have a Black Jack', () => {
				it('should set the game status to draw', () => {
		        	GameStoreRewireAPI.__Rewire__('DeckStore', {
		        		hasBlackJack: () => true,
		        	});
		        	registeredCallback({
		                action: {
		                    actionType: 'PLAYER_STICK',
		                }
		            });
		            const game = getAllGameState();
		            expect(game.status).toBe(GAME.STATUS.DRAW);
		            
		        });
			});

			context('when the player has a Black Jack', () => {
				it('should set the game status to player wins', () => {
		        	GameStoreRewireAPI.__Rewire__('DeckStore', {
		        		hasBlackJack: (player) => player === PLAYERS.PLAYER ? true : false,
		        	});
		        	registeredCallback({
		                action: {
		                    actionType: 'PLAYER_STICK',
		                }
		            });
		            const game = getAllGameState();
		            expect(game.status).toBe(GAME.STATUS.PLAYER_WINS);
		        });
			});

			context('when the dealer has a Black Jack', () => {
				it('should set the game status to dealer wins', () => {
		        	GameStoreRewireAPI.__Rewire__('DeckStore', {
		        		hasBlackJack: (player) => player === PLAYERS.DEALER ? true : false,
		        	});
		        	registeredCallback({
		                action: {
		                    actionType: 'PLAYER_STICK',
		                }
		            });
		            const game = getAllGameState();
		            expect(game.status).toBe(GAME.STATUS.DEALER_WINS);
		        });
			});

			context('when neither the dealer nor player has a Black Jack', () => {
				it('should set the game status to dealer is in play', () => {
		        	GameStoreRewireAPI.__Rewire__('DeckStore', {
		        		hasBlackJack: () => false,
		        	});
		        	/* The game store gets mutated with each action we dispatch. I can't find a way to 
		        		reset the game store with babel-rewire (without rewiring it, which we don't want). 
		        		A DECK_DEAL action resests the store to the initial state needed here. 
		        		We could have a store reset action just for tests that resets the store to 
		        		initial state, but putting test code in production code mixes concerns and should 
		        		not be necessary. I'm going to say 'Flux just wasn't designed with testing in mind'...
        			*/
		        	registeredCallback({
		                action: {
		                    actionType: 'DECK_DEAL',
		                }
		            });
		        	registeredCallback({
		                action: {
		                    actionType: 'PLAYER_STICK',
		                }
		            });
		            const game = getAllGameState();
		            expect(game.status).toBe(GAME.STATUS.DEALER_IS_IN_PLAY);
		        });
			});
		});

		context('DEALER_IS_IN_PLAY action is dispatched', () => {
			context('when the dealer busts', () => {
				it('should set the game status to player wins', () => {
					GameStoreRewireAPI.__Rewire__('DeckStore', {
		        		isBust: () => true,
		        		getStrongestHandValue: () => {},
		        	});
		        	/* See comment in 'PLAYER_STICK action is dispatched' suite */
		        	registeredCallback({
		                action: {
		                    actionType: 'DECK_DEAL',
		                }
		            });
		        	registeredCallback({
		                action: {
		                    actionType: 'DEALER_IS_IN_PLAY',
		                }
		            });
		            const game = getAllGameState();
		            expect(game.status).toBe(GAME.STATUS.PLAYER_WINS);
				});
			});

			context('when the player has the strongest hand', () => {
				it('should set the game status to player wins', () => {
					GameStoreRewireAPI.__Rewire__('DeckStore', {
		        		isBust: () => false,
		        		getStrongestHandValue: (player) => player === PLAYERS.PLAYER ? 21 : 20,
		        	});
		        	/* See comment in 'PLAYER_STICK action is dispatched' suite */
		        	registeredCallback({
		                action: {
		                    actionType: 'DECK_DEAL',
		                }
		            });
		        	registeredCallback({
		                action: {
		                    actionType: 'DEALER_IS_IN_PLAY',
		                }
		            });
		            const game = getAllGameState();
		            expect(game.status).toBe(GAME.STATUS.PLAYER_WINS);
				});
			});

			context('when the dealer has the strongest hand', () => {
				it('should set the game status to dealer wins', () => {
					GameStoreRewireAPI.__Rewire__('DeckStore', {
		        		isBust: () => false,
		        		getStrongestHandValue: (player) => player === PLAYERS.DEALER ? 21 : 20,
		        	});
		        	/* See comment in 'PLAYER_STICK action is dispatched' suite */
		        	registeredCallback({
		                action: {
		                    actionType: 'DECK_DEAL',
		                }
		            });
		        	registeredCallback({
		                action: {
		                    actionType: 'DEALER_IS_IN_PLAY',
		                }
		            });
		            const game = getAllGameState();
		            expect(game.status).toBe(GAME.STATUS.DEALER_WINS);
				});
			});

			context('when player and dealer hands are the same value', () => {
				it('should set the game status to draw', () => {
					GameStoreRewireAPI.__Rewire__('DeckStore', {
		        		isBust: () => false,
		        		getStrongestHandValue: () => 20,
		        	});
		        	/* See comment in 'PLAYER_STICK action is dispatched' suite */
		        	registeredCallback({
		                action: {
		                    actionType: 'DECK_DEAL',
		                }
		            });
		        	registeredCallback({
		                action: {
		                    actionType: 'DEALER_IS_IN_PLAY',
		                }
		            });
		            const game = getAllGameState();
		            expect(game.status).toBe(GAME.STATUS.DRAW);
				});
			});
		});
    });

    describe('Public methods', () => {
    	let registeredCallback, getAllGameState;
        beforeEach(() => {
            registeredCallback = GameStoreRewireAPI.__GetDependency__('registeredCallback');
            getAllGameState = GameStoreRewireAPI.__GetDependency__('getAllGameState');
        });
        afterEach(() => {
            GameStoreRewireAPI.__ResetDependency__('game');
        });
        it('should return the game store state', () => {
            GameStoreRewireAPI.__Rewire__('game', {
                status: 'SOME_GAME_STATUS',
            });
            const actual = getAllGameState();
            const expected = { 
            	status: 'SOME_GAME_STATUS',
            };
            expect(actual).toEqual(expected);
        });
    });
});
