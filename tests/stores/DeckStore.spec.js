import expect from 'expect';
import { __RewireAPI__ as DeckStoreRewireAPI } from '../../src/app/stores/DeckStore';
import * as DeckStore from '../../src/app/stores/DeckStore';
import { CARDS, PLAYERS, GAME_PARAMETERS } from '../../src/app/constants/config';

describe('DeckStore', () => {
    describe('Private methods', () => {
        describe('_createCardDeck()', () => {
            const deck = DeckStore._createCardDeck();
            it('should create a 52 card deck', () => {
                const cardsCount = deck.length;
                expect(cardsCount).toBe(52);
            });
            describe('suits', () => {
                CARDS.SUITS.forEach((suit) => {
                    const suitCount = deck.filter((card) => card.suit === suit).length;
                    it(`should have ${CARDS.FACE_VALUES_COUNT} ${suit}`, () => {
                        expect(suitCount).toBe(CARDS.FACE_VALUES_COUNT);
                    });
                });
            });
            describe('face values', () => {
                CARDS.FACE_VALUES.forEach((faceValue) => {
                    const value = deck.filter((card) => card.faceValue === faceValue).length;
                    it(`should have four ${faceValue}'s`, () => {
                        expect(value).toBe(4);
                    });
                });
            });
            describe('values', () => {
                it('should have a total pack value of 340', () => {
                    const totalValue = deck.reduce((prev, curr) => {
                        return prev += curr.value;
                    },0);
                    expect(totalValue).toBe(340);
                });
             });
        });

        describe('_newDeck()', () => {
            const deck = {};
            it('should add a new card deck to the passed-in object', () => {
                DeckStore._newDeck(deck);
                expect(deck.undealtCards).toExist();
                expect(deck.undealtCards.length).toBe(52);
            });
        });

        describe('_dealCards()', () => {
            it('should return the first n cards from the deck and mutate the deck', () => {
                const deck = {
                    undealtCards: [1, 2, 3, 4, 5, 6]
                };
                const dealtCards = DeckStore._dealCards(2, deck);
                expect(dealtCards).toEqual([1, 2]);
                expect(deck.undealtCards).toEqual([3, 4, 5, 6]);
            });
        });

        describe('_isBlackJack()', () => {
             const hands = [
                [{},{},{}],
                [
                    {
                        value: 5,
                        faceValue: 5,
                        suit: 'clubs',
                    },
                    {
                        value: 5,
                        faceValue: 5,
                        suit: 'spades',
                    },
                ],
                [
                    {
                        value: 1,
                        faceValue: 1,
                        suit: 'clubs',
                    },
                    {
                        value: 5,
                        faceValue: 5,
                        suit: 'spades',
                    },
                ],
                [
                    {
                        value: 1,
                        faceValue: 1,
                        suit: 'clubs',
                    },
                    {
                        value: 10,
                        faceValue: 12,
                        suit: 'spades',
                    },
                ],
            ];
            const scenarios = [
                {
                    context: 'when there are more than 2 cards in the hand',
                    assertion: 'should return false',
                    expected: false,
                },
                {
                    context: 'when there is no ace in the hand',
                    assertion: 'should return false',
                    expected: false,
                },
                {
                    context: 'when there is an ace in the hand but the hand is not a Black Jack',
                    assertion: 'should return false',
                    expected: false,
                },
                {
                    context: 'when there is an ace in the hand and the hand is a Black Jack',
                    assertion: 'should return true',
                    expected: true,
                }
            ];
            scenarios.forEach((scenario, i) => {
                const actual = DeckStore._isBlackJack(hands[i]);
                context(scenario.context, () => {
                    it(scenario.assertion, () => {
                        expect(actual).toEqual(scenario.expected);
                    });
                });
            });
        });

        describe('_getHandValue()', () => {
            const handNoAce = [
                {
                    value: 5,
                    faceValue: 5,
                    suit: 'clubs',
                },
                {
                    value: 8,
                    faceValue: 8,
                    suit: 'hearts',
                },
                {
                    value: 7,
                    faceValue: 7,
                    suit: 'diamonds',
                },
            ];
            const handWithAce = [
                 {
                    value: 5,
                    faceValue: 5,
                    suit: 'clubs',
                },
                {
                    value: 8,
                    faceValue: 8,
                    suit: 'hearts',
                },
                {
                    value: 7,
                    faceValue: 7,
                    suit: 'diamonds',
                },
                {
                    value: 1,
                    faceValue: 1,
                    suit: 'spades',
                },
            ];
            const scenarios = [
                {
                    context: 'when there are no aces in the hand',
                    assertion: 'should return the sum of card values',
                    hand: handNoAce,
                    expected: 20,
                    ace: undefined,
                },
                {
                    context: 'when there is an ace in the hand and the ace value is low',
                    assertion: 'should return the sum of card values with ace as 1',
                    hand: handWithAce,
                    expected: 21,
                    ace: undefined,
                },
                {
                    context: 'when there is an ace in the hand and the ace value is high',
                    assertion: 'should return the sum of card values with ace as 11',
                    hand: handWithAce,
                    expected: 31,
                    ace: CARDS.ACE_HIGH,
                }
            ];
            scenarios.forEach((scenario) => {
                const actual = DeckStore._getHandValue(scenario.hand, scenario.ace);
                context(scenario.context, () => {
                    it(scenario.assertion, () => {
                        expect(actual).toEqual(scenario.expected);
                    });
                });
            });
        });

        describe('_isBust()', () => {
            const notBust = [
                [
                    {
                        value: 5,
                        faceValue: 5,
                        suit: 'clubs',
                    },
                    {
                        value: 5,
                        faceValue: 5,
                        suit: 'spades',
                    },
                ],
                [
                    {
                        value: 10,
                        faceValue: 12,
                        suit: 'clubs',
                    },
                    {
                        value: 10,
                        faceValue: 11,
                        suit: 'spades',
                    },
                     {
                        value: 1,
                        faceValue: 1,
                        suit: 'spades',
                    },
                ],
            ];
            const bust = [
                [
                    {
                        value: 7,
                        faceValue: 7,
                        suit: 'clubs',
                    },
                    {
                        value: 5,
                        faceValue: 5,
                        suit: 'spades',
                    },
                     {
                        value: 10,
                        faceValue: 13,
                        suit: 'spades',
                    },
                ],
                [
                    {
                        value: 1,
                        faceValue: 5,
                        suit: 'clubs',
                    },

                    {
                        value: 10,
                        faceValue: 12,
                        suit: 'spades',
                    },
                    {
                        value: 6,
                        faceValue: 6,
                        suit: 'spades',
                    },
                    {
                        value: 5,
                        faceValue: 5,
                        suit: 'spades',
                    },
                ],
            ];
            it('should return false when the hand value is not greater than 21', () => {
                notBust.forEach((hand) => {
                    const actual = DeckStore._isBust(hand);
                    expect(actual).toEqual(false);
                });
            });
            it('should return true when the hand value is greater than 21', () => {
                bust.forEach((hand) => {
                    const actual = DeckStore._isBust(hand);
                    expect(actual).toEqual(true);
                });
            });
        });

        describe('_dealerHit()', () => {
            afterEach(() => {
                DeckStoreRewireAPI.__ResetDependency__('deck');
            });
            context('when there are no aces in the resulting hand', () => {
                 it(`should return a hand of value ${GAME_PARAMETERS.DEALER_STICK_VALUE} or greater`, ()=> {
                    DeckStoreRewireAPI.__Rewire__('deck', {
                        undealtCards: [
                            { value: 5 },
                            { value: 6 },
                            { value: 7 },
                            { value: 8 },
                        ],
                    });
                    const initialDealerHand = [
                        { value: 2 },
                        { value: 3 },
                        { value: 4 },
                    ];
                    const actual = DeckStore._dealerHit(initialDealerHand);
                    const expected = [
                        { value: 2 },
                        { value: 3 },
                        { value: 4 },
                        { value: 5 },
                        { value: 6 },
                    ];
                    expect(actual).toEqual(expected);
                });
            });
            context('when there are aces in the resulting hand', () => {
                 it(`should treat aces as their high value and return a hand of value ${GAME_PARAMETERS.DEALER_STICK_VALUE} or greater`, ()=> {
                     DeckStoreRewireAPI.__Rewire__('deck', {
                        undealtCards: [
                            { value: 1 },
                            { value: 6 },
                            { value: 7 },
                        ],
                    });
                    const initialDealerHand = [
                        { value: 2 },
                        { value: 3 },
                        { value: 4 },
                    ];
                    const expected = [
                        { value: 2 },
                        { value: 3 },
                        { value: 4 },
                        { value: 1 },
                    ];
                    const actual = DeckStore._dealerHit(initialDealerHand);
                    expect(actual).toEqual(expected);
                });
            });
        });
        
        describe('_getStrongestHandValue()', () => {
            context('when there are no aces in the hand', () => {
                it('should return the hand value', ()=> {
                    const hand = [
                        {
                            value: 7,
                            faceValue: 7,
                            suit: 'clubs',
                        },
                        {
                            value: 5,
                            faceValue: 5,
                            suit: 'spades',
                        },
                        {
                            value: 10,
                            faceValue: 13,
                            suit: 'spades',
                        },
                    ];
                    const actual = DeckStore._getStrongestHandValue(hand);
                    expect(actual).toBe(22);
                });
            });
            context('when there are aces in the hand', () => {
                context('when the high ace makes the hand bust', () => {
                     it('should return the hand value using the ace low value', ()=> {
                        const hand = [
                            {
                                value: 7,
                                faceValue: 7,
                                suit: 'clubs',
                            },
                            {
                                value: 5,
                                faceValue: 5,
                                suit: 'spades',
                            },
                             {
                                value: 1,
                                faceValue: 1,
                                suit: 'spades',
                            },
                        ];
                        const actual = DeckStore._getStrongestHandValue(hand);
                        expect(actual).toBe(13);
                    });
                });
                context('when the high ace does not make the hand bust', () => {
                     it('should return the hand value using the ace high value', ()=> {
                        const hand = [
                            {
                                value: 7,
                                faceValue: 7,
                                suit: 'clubs',
                            },
                            {
                                value: 3,
                                faceValue: 3,
                                suit: 'spades',
                            },
                            {
                                value: 1,
                                faceValue: 1,
                                suit: 'spades',
                            },
                        ];
                        const actual = DeckStore._getStrongestHandValue(hand);
                        expect(actual).toBe(21);
                    });
                });
            });
        });
    });

    describe('Store state updates', () => {
        let registeredCallback, getAllDeck;
        beforeEach(() => {
            registeredCallback = DeckStoreRewireAPI.__GetDependency__('registeredCallback');
            getAllDeck = DeckStoreRewireAPI.__GetDependency__('getAllDeck');
        });    
     
        it('should not update the store when an unknown action is dispatched', () => {
            registeredCallback({
                action: {
                    actionType: 'UNKNOWN_ACTION',
                }
            });
            const actual = getAllDeck();
            const initialDeck = {
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
                    [PLAYERS.PLAYER]: null,
                    [PLAYERS.DEALER]: null,
                },
            };
            expect(actual).toEqual(initialDeck);
        });

        context('DECK_DEAL action is dispatched', () => {
             it(`should update the store:
                    decrement the undealtCards count by 4,
                    set the dealer\'s first card to be hidden,
                    deal 2 cards to the player,
                    deal 2 cards to the dealer,
                    check whether dealer and player are bust`, () => {
                registeredCallback({
                    action: {
                        actionType: 'DECK_DEAL',
                    }
                });
                const deck = getAllDeck();
                expect(deck.undealtCards.length).toBe(48);
                expect(deck.dealerHiddenCard).toBe(0);
                expect(deck.hand[PLAYERS.PLAYER].length).toBe(2);
                expect(deck.hand[PLAYERS.DEALER].length).toBe(2);
                expect(deck.blackJack[PLAYERS.PLAYER]).toNotBe(null);
                expect(deck.blackJack[PLAYERS.DEALER]).toNotBe(null);
            });
        });

        context('PLAYER_HIT action is dispatched', () => {
            it(`should update the store:
                    decrememt undealtCards by 1,
                    increase the player\'s card count by 1,
                    check whether the player is bust`, () => {
                registeredCallback({
                    action: {
                        actionType: 'PLAYER_HIT',
                    }
                });
                const deck = getAllDeck();
                expect(deck.undealtCards.length).toBe(47);
                expect(deck.hand[PLAYERS.PLAYER].length).toBe(3);
                expect(deck.isBust[PLAYERS.PLAYER]).toNotBe(null);
            });
        });
        
        context('PLAYER_STICK action is dispatched', () => {
            it('should expose the dealer\'s hidden card', () => {
                registeredCallback({
                    action: {
                        actionType: 'PLAYER_STICK',
                    }
                });
                const deck = getAllDeck();
                expect(deck.dealerHiddenCard).toBe(null);
            });
        });
        
        context('DEALER_IS_IN_PLAY action is dispatched', () => {
             it('should update the dealer\'s hand and verify if the dealer is bust', () => {
                registeredCallback({
                    action: {
                        actionType: 'DEALER_IS_IN_PLAY',
                    }
                });
                const deck = getAllDeck();
                expect(deck.hand[PLAYERS.DEALER].length >= 2).toBe(true); // TODO: how to test because non-deterministic?
                expect(deck.isBust[PLAYERS.DEALER]).toNotBe(null);
            });
        });
    });

    describe('Public methods', () => {
        describe('hasBlackJack()', () => {
            let hasBlackJack;
            beforeEach(() => {
                hasBlackJack = DeckStoreRewireAPI.__GetDependency__('hasBlackJack');
            });
            afterEach(() => {
                DeckStoreRewireAPI.__ResetDependency__('deck');
            });
            it('should return true when the given player has a Black Jack', () => {
                DeckStoreRewireAPI.__Rewire__('deck', {
                    blackJack: {
                        PLAYER: true,
                    }
                });
                expect(hasBlackJack([PLAYERS.PLAYER])).toBe(true);
            });
            it('should return false when the given player does not have a Black Jack', () => {
                DeckStoreRewireAPI.__Rewire__('deck', {
                    blackJack: {
                        PLAYER: false,
                    }
                });
                expect(hasBlackJack([PLAYERS.PLAYER])).toBe(false);
            });
        });

        describe('isBust()', () => {
            let isBust;
            beforeEach(() => {
                isBust = DeckStoreRewireAPI.__GetDependency__('isBust');
            });
            afterEach(() => {
                DeckStoreRewireAPI.__ResetDependency__('deck');
            });
            it('should return true when the given player is bust', () => {
                DeckStoreRewireAPI.__Rewire__('deck', {
                    isBust: {
                        PLAYER: true,
                    }
                });
                expect(isBust([PLAYERS.PLAYER])).toBe(true);
            });
            it('should return false when the given player is not bust', () => {
                DeckStoreRewireAPI.__Rewire__('deck', {
                    isBust: {
                        PLAYER: false,
                    }
                });
                expect(isBust([PLAYERS.PLAYER])).toBe(false);
            });
        });

        describe('getHandValue()', () => {
            let getHandValue;
            beforeEach(() => {
                getHandValue = DeckStoreRewireAPI.__GetDependency__('getHandValue');
            });
            afterEach(() => {
                DeckStoreRewireAPI.__ResetDependency__('deck');
            });
            it('should return the total hand value when the given ace value is low', () => {
                DeckStoreRewireAPI.__Rewire__('deck', {
                    hand: {
                        PLAYER: [
                            { value: 1 },
                            { value: 2 },
                        ],
                    }
                });
                expect(getHandValue([PLAYERS.PLAYER])).toBe(3);
            });
            it('should return the total hand value when the given ace value is high', () => {
                DeckStoreRewireAPI.__Rewire__('deck', {
                   hand: {
                        PLAYER: [
                            { value: 1 },
                            { value: 2 },
                        ],
                    }
                });
                expect(getHandValue([PLAYERS.PLAYER], CARDS.ACE_HIGH)).toBe(13);
            });
            it('should return the total hand value when no aces are in the hand', () => {
                DeckStoreRewireAPI.__Rewire__('deck', {
                    hand: {
                        PLAYER: [
                            { value: 6 },
                            { value: 2 },
                        ],
                    }
                });
                expect(getHandValue([PLAYERS.PLAYER])).toBe(8);
            });
        });

        describe('getStrongestHandValue()', () => {
            let getStrongestHandValue;
            beforeEach(() => {
                getStrongestHandValue = DeckStoreRewireAPI.__GetDependency__('getStrongestHandValue');
            });
            afterEach(() => {
                DeckStoreRewireAPI.__ResetDependency__('deck');
            });

            context('when the hand is not bust when counting the ace as high', () => {
                it('should return the total hand value counting the ace as high', () => {
                DeckStoreRewireAPI.__Rewire__('deck', {
                        hand: {
                            PLAYER: [
                                { value: 1 },
                                { value: 5 },
                                { value: 5 },
                            ],
                        }
                    });
                    expect(getStrongestHandValue([PLAYERS.PLAYER])).toBe(21);
                });
            });
            
            context(' when the hand would be bust when counting the ace as high', () => {
                it('should return the total hand value counting the ace as low', () => {
                    DeckStoreRewireAPI.__Rewire__('deck', {
                        hand: {
                            PLAYER: [
                                { value: 1 },
                                { value: 5 },
                                { value: 6 },
                            ],
                        }
                    });
                    expect(getStrongestHandValue([PLAYERS.PLAYER])).toBe(12);
                });
            });
        });
    });
});
