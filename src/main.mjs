import './card-select.mjs';
import {RANKS, SUITS} from './constants.mjs';

function createShuffledDeck() {
    const cards = RANKS.flatMap((rank) => SUITS.map((suit) => `${rank}-of-${suit}`));

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
