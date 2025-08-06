import './card-select.mjs';
import {RANKS, SUITS} from './constants.mjs';

/**
 * @return {string[]}
 */
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

    /** @type {CardSelect} */
    #cardSelect = document.querySelector('card-select');
    /** @type {HTMLOutputElement} */
    #guessesOutput = document.querySelector('output[name=guesses]');

    constructor() {
        this.#cardSelect.addEventListener('guess', (e) => {
            const { rank, suit } = e.detail;
            this.guess(`${rank}-of-${suit}`);
        });
    }

    guess(cid) {
        if (this.#gameOver) {
            return;
        }

        const actualCid = this.#cards.pop();
        this.#guessesOutput.value = `${this.#cards.length}`;
        this.#cardSelect.disableCard(actualCid);

        let message = `You guessed ${cid}, top card was ${actualCid}\n\n`;
        if (cid === actualCid) {
            message += 'Correct! You win!';
            this.#gameOver = true;
        } else if (this.#cards.length === 0) {
            message += 'Nope. Game over.';
            this.#gameOver = true;
        } else {
            message += 'Nope. Try again!';
        }
        window.alert(message);
    }
}

window.game = new Game();
