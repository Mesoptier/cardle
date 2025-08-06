const SUITS = ['S', 'H', 'D', 'C'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createShuffledDeck() {
    const cards = SUITS.flatMap((suit) => RANKS.map((rank) => `${rank}${suit}`));

    for (let i = cards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    return cards;
}

class Game {
    #cards = createShuffledDeck();
    #gameOver = false;

    guess(cid) {
        if (this.#gameOver) {
            return;
        }

        const actualCid = this.#cards.pop();
        let message;
        if (cid === actualCid) {
            message = 'Correct! You win!';
            this.#gameOver = true;
        } else if (this.#cards.length === 0) {
            message = 'Nope. Game over.';
            this.#gameOver = true;
        } else {
            message = 'Nope. Try again!';
        }
        window.alert(message);
    }

}

window.game = new Game();
