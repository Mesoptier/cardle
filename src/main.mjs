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

    #cardStack = document.querySelector('.card-stack');
    /** @type {CardSelect} */
    #cardSelect = document.querySelector('card-select');

    constructor() {
        this.#cardSelect.addEventListener('guess', (e) => {
            const { rank, suit } = e.detail;
            this.guess(`${rank}-of-${suit}`);
        });

        this.#cards.forEach(() => {
            const card = document.createElement('playing-card');
            card.setAttribute('rank', '0');
            card.setAttribute('borderline', '0');
            card.setAttribute('borderradius', '0');
            card.setAttribute('bordercolor', '0');

            const li = document.createElement('li');
            li.append(card);

            this.#cardStack.append(li);
        })
    }

    guess(cid) {
        if (this.#gameOver) {
            return;
        }

        const actualCid = this.#cards.pop();
        this.#cardSelect.disableCard(actualCid);

        const [rank,, suit] = actualCid.split('-');
        const topLi = this.#cardStack.lastElementChild;
        const topCard = topLi.lastElementChild;
        topCard.setAttribute('suit', suit);
        topCard.setAttribute('rank', rank);
        setTimeout(() => {
            topLi.remove();
        }, 500);

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
        // window.alert(message);
    }
}

window.game = new Game();
