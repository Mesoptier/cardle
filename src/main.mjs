import './card-art.mjs';
import './card-select.mjs';
import {FACE_RANKS, RANKS, SUIT_COLORS, SUITS} from './constants.mjs';

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
            const {rank, suit} = e.detail;
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

    async guess(guessedCid) {
        if (this.#gameOver) {
            return;
        }

        const actualCid = this.#cards.pop();

        void this.#revealTopCard(actualCid, this.#cards.length);

        if (guessedCid === actualCid) {
            this.#showMessage('Correct! You win!', 'bounce');
            this.#gameOver = true;
        } else {
            // Remove card from selectable options
            // TODO: Disable this behavior in a "Hard mode"?
            this.#cardSelect.disabledCards = [...this.#cardSelect.disabledCards, actualCid];

            const incorrectMessage = getIncorrectMessage(guessedCid, actualCid);
            const continueMessage = this.#cards.length === 0 ? 'Game over!' : 'Try again!';
            this.#showMessage(`${incorrectMessage} ${continueMessage}`, 'wiggle');

            if (this.#cards.length === 0) {
                this.#gameOver = true;
            }
        }

        if (this.#gameOver) {
            this.#cardSelect.readOnly = true;
        }
    }

    async #revealTopCard(cid, index) {
        const [rank, , suit] = cid.split('-');
        const cardLi = this.#cardStack.children.item(index);

        // Discard previously revealed cards
        let nextCardLi = cardLi.nextElementSibling;
        while (nextCardLi) {
            void this.#discardCard(nextCardLi);
            nextCardLi = nextCardLi.nextElementSibling;
        }

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
    }

    async #discardCard(cardLi) {
        const cardSizer = cardLi.lastElementChild;

        cardSizer.classList.remove('sizer--animate-flip');
        cardSizer.classList.add('sizer--animate-exit');

        await delay(500);
        cardLi.remove();
    }

    #showMessage(message, animationClass = null) {
        const messageEl = document.querySelector('.message');
        messageEl.innerText = message;
        messageEl.classList.remove('wiggle', 'bounce');

        if (animationClass) {
            messageEl.offsetWidth;
            messageEl.classList.add(animationClass);
        }
    }
}

new Game();

function delay(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

function getRankSimilarity(guessedRank, actualRank) {
    if (guessedRank === actualRank) {
        return 'RANKS_SAME';
    }

    if (FACE_RANKS.includes(guessedRank) && FACE_RANKS.includes(actualRank)) {
        return 'RANKS_BOTH_FACE';
    }

    const guessedIndex = RANKS.indexOf(guessedRank);
    const actualIndex = RANKS.indexOf(actualRank);
    if (Math.abs((guessedIndex - actualIndex)) % 13 === 1) {
        return 'RANKS_ONE_AWAY';
    }

    return 'RANKS_DIFFERENT';
}

function getSuitSimilarity(guessedSuit, actualSuit) {
    if (guessedSuit === actualSuit) {
        return 'SUITS_SAME';
    } else if (SUIT_COLORS[guessedSuit] === SUIT_COLORS[actualSuit]) {
        return 'SUITS_SAME_COLOR';
    } else {
        return 'SUITS_DIFFERENT';
    }
}

function getIncorrectMessage(guessedCid, actualCid) {
    const [guessedRank, , guessedSuit] = guessedCid.split('-');
    const [actualRank, , actualSuit] = actualCid.split('-');
    const rankSimilarity = getRankSimilarity(guessedRank, actualRank);
    const suitSimilarity = getSuitSimilarity(guessedSuit, actualSuit);

    const MESSAGES_WAY_OFF = ['Not even close.', 'Way off.'];
    const MESSAGES_NOPE = ['Nope.', 'That\'s not it.' ];
    const MESSAGES_CLOSE = ['Close.', 'Close, but nope.'];
    const MESSAGES_VERY_CLOSE = ['Very close!', 'Almost had it!']

    let messages = MESSAGES_NOPE;
    if (rankSimilarity === 'RANKS_DIFFERENT' && suitSimilarity === 'SUITS_DIFFERENT') {
        messages = MESSAGES_WAY_OFF;
    } else if (rankSimilarity === 'RANKS_SAME') {
        if (suitSimilarity === 'SUITS_SAME_COLOR') {
            messages = MESSAGES_VERY_CLOSE;
        } else {
            messages = MESSAGES_CLOSE;
        }
    } else if (rankSimilarity === 'RANKS_ONE_AWAY') {
        if (suitSimilarity === 'SUITS_SAME') {
            messages = MESSAGES_VERY_CLOSE;
        } else {
            messages = MESSAGES_NOPE;
        }
    } else if (rankSimilarity === 'RANKS_BOTH_FACE') {
        if (suitSimilarity === 'SUITS_SAME' || suitSimilarity === 'SUITS_SAME_COLOR') {
            messages = MESSAGES_CLOSE;
        } else {
            messages = MESSAGES_NOPE;
        }
    }

    return messages[Math.floor(Math.random() * messages.length)];
}
