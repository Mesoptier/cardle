import './card-art.mjs';
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
            /** @type {CardArt} */
            const cardArt = document.createElement('card-art');
            cardArt.face = 'back';

            const cardFace = document.createElement('div');
            cardFace.classList.add('face');
            cardFace.append(cardArt);

            const sizer = document.createElement('div');
            sizer.classList.add('sizer');
            sizer.append(cardFace);

            const li = document.createElement('li');
            li.append(sizer);

            this.#cardStack.append(li);
        })
    }

    async guess(cid) {
        if (this.#gameOver) {
            return;
        }

        const actualCid = this.#cards.pop();
        const cardStackIndex = this.#cards.length;
        const [rank,, suit] = actualCid.split('-');

        const cardLi = this.#cardStack.children.item(cardStackIndex);
        const cardSizer = cardLi.lastElementChild;

        /** @type {CardArt} */
        const cardArt = document.createElement('card-art');
        cardArt.face = 'front';
        cardArt.suit = suit;
        cardArt.rank = rank;

        const cardFace = document.createElement('div');
        cardFace.classList.add('face');
        cardFace.append(cardArt);

        cardSizer.append(cardFace);
        cardSizer.offsetWidth; // Trigger layout, so the transition works properly
        cardSizer.classList.add('sizer--animate-flip');

        const messageEl = document.querySelector('#message');

        if (cid === actualCid) {
            messageEl.innerText = 'Correct! You win!';
            this.#cardSelect.readOnly = true;
            this.#gameOver = true;
        } else {
            // Remove card from selectable options
            // TODO: Disable this behavior in a "Hard mode"?
            this.#cardSelect.disabledCards = [...this.#cardSelect.disabledCards, actualCid];

            if (this.#cards.length === 0) {
                messageEl.innerText = 'Nope. Game over.';
                this.#cardSelect.readOnly = true;
                this.#gameOver = true;
            } else {
                messageEl.innerText = 'Nope. Try again!';
            }

            await delay(500);

            cardSizer.classList.remove('sizer--animate-flip');
            cardSizer.classList.add('sizer--animate-exit');

            await delay(500);
            cardLi.remove();
        }
    }
}

window.game = new Game();

function delay(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}
