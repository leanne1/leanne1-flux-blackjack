# leanne1-flux-blackjack

## Run up the app

[Node.js](http://nodejs.org/) >= v4 must be installed.

## Installation

- Clone this repo
- Run `npm install`
- `npm start` > [http://localhost:3000](http://localhost:3000)

## Game play

### Game objective
- Blackjack is played with an international 52-card deck without jokers
- The game is played between a dealer and a single player
- The aim of the game is for the player to accumulate a higher point total than the dealer, but without going over 21 points. The player computes their score by adding the values of their individual cards.

### Card values
- The cards 2 to 10 have their face value, Jack, Queen, and King are worth 10 points each, and the Ace is worth either 1 or 11 points (player's and dealer's choice).

### The game
- At the start of a blackjack game, the player and the dealer receive two cards each. The player's cards are normally dealt face up, while the dealer has one face down (hidden from the player) and one face up.
- The best possible blackjack hand is an opening deal of an ace with any ten-point card. This is called a 'blackjack', or a natural 21.
- After the cards have been dealt the player must choose to either keep their hand as it is ('stick') or take more cards from the deck ('hit'), one at a time, until either the player judges that the hand is strong enough to go up against the dealer's hand and stands, or until it goes over 21, in which case the player immediately loses ('busts'). The player can take as many cards as s/he likes, as long as they don't bust.
- Once the player has decided to stick, the dealer turns over their second hidden card.
- If the dealer has a blackjack (but not the player) then the player loses. If the player has a blackjack (but not the dealer) the player wins. If both player and dealer have a blackjack he games ends in a draw. 
- If the game is still in play (neither player nor dealer have a blackjack), the dealer hits (takes more cards) or stands depending on the value of the hand. Contrary to the player, the dealer's action is completely dictated by the rules. The dealer must hit if the value of the hand is lower than 17, otherwise the dealer will stick.
- If the dealer goes bust the player wins. Otherwise, if the player has a higher point total than the dealer the player wins. If the player has a lower point total than the dealer the dealer wins. If the player and dealer have the same point total the game is a draw.
