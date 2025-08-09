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

            const sizer = document.createElement('div');
            sizer.classList.add('sizer');
            sizer.append(card);

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

        const card = document.createElement('playing-card');
        card.setAttribute('suit', suit);
        card.setAttribute('rank', rank);
        card.setAttribute('borderline', '0');
        card.setAttribute('borderradius', '0');
        card.setAttribute('bordercolor', '0');
        cardSizer.append(card);

        cardSizer.offsetWidth; // Trigger layout, so the transition works properly
        cardSizer.classList.add('sizer--animate-flip');

        const messageEl = document.querySelector('#message');

        if (cid === actualCid) {
            messageEl.innerText = 'Correct! You win!';
            this.#gameOver = true;
        } else {
            this.#cardSelect.disableCard(actualCid);
            if (this.#cards.length === 0) {
                messageEl.innerText = 'Nope. Game over.';
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
