import expect from 'expect'
import * as DeckStore from '../../src/app/stores/DeckStore'

describe('DeckStore', () => {
    describe('Private methods', () => {
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
                    context: 'when there is an ace in the hand but hand is not a Black Jack',
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
                    context: 'when there is an ace in the hand and the ace is low',
                    assertion: 'should return the sum of card values with ace as 1',
                    hand: handWithAce,
                    expected: 21,
                    ace: undefined,
                },
                {
                    context: 'when there is an ace in the hand and the ace is high',
                    assertion: 'should return the sum of card values with ace as 11',
                    hand: handWithAce,
                    expected: 31,
                    ace: 'high',
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
    });
});
