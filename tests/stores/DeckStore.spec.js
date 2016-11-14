import expect from 'expect'
import * as DeckStore from '../../src/app/stores/DeckStore'
import { CARDS } from '../../src/app/constants/config';

describe('DeckStore', () => {
    describe('Private methods', () => {
        describe('createCardDeck()', () => {
            const deck = DeckStore.createCardDeck();
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

        describe('newDeck()', () => {
            const deck = {};
            it('should add a new card deck to the passed-in object', () => {
                DeckStore.newDeck(deck);
                expect(deck.undealtCards).toExist();
                expect(deck.undealtCards.length).toBe(52);
            });
        });

        describe('dealCards()', () => {
            it('should return the first n cards from the deck and mutate the deck', () => {
                const deck = {
                    undealtCards: [1, 2, 3, 4, 5, 6]
                };
                const dealtCards = DeckStore.dealCards(2, deck);
                expect(dealtCards).toEqual([1, 2]);
                expect(deck.undealtCards).toEqual([3, 4, 5, 6]);
            });
        });

        describe('isBlackJack()', () => {
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
                const actual = DeckStore.isBlackJack(hands[i]);
                context(scenario.context, () => {
                    it(scenario.assertion, () => {
                        expect(actual).toEqual(scenario.expected);
                    });
                });
            });
        });

        describe('getHandValue()', () => {
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
                const actual = DeckStore.getHandValue(scenario.hand, scenario.ace);
                context(scenario.context, () => {
                    it(scenario.assertion, () => {
                        expect(actual).toEqual(scenario.expected);
                    });
                });
            });
        });

        describe('isBust()', () => {
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
                    const actual = DeckStore.isBust(hand);
                    expect(actual).toEqual(false);
                });
            });
            it('should return true when the hand value is greater than 21', () => {
                bust.forEach((hand) => {
                    const actual = DeckStore.isBust(hand);
                    expect(actual).toEqual(true);
                });
            });
        });

        describe('getStrongestHandValue()', () => {
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
                    const actual = DeckStore.getStrongestHandValue(hand);
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
                        const actual = DeckStore.getStrongestHandValue(hand);
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
                        const actual = DeckStore.getStrongestHandValue(hand);
                        expect(actual).toBe(21);
                    });
                });
            });
        });
    });
});
