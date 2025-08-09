import {RANKS, SUIT_COLORS, SUIT_SYMBOLS, SUITS} from './constants.mjs';

class CardSelect extends HTMLElement {
    /** @type {string|null} */
    #suitValue;
    /** @type {string|null} */
    #rankValue;
    #disabledCards = [];

    get suit() {
        return this.#suitValue;
    }
    set suit(suitValue) {
        this.#suitValue = suitValue;
        this.#update();
    }

    get rank() {
        return this.#rankValue;
    }
    set rank(rankValue) {
        this.#rankValue = rankValue;
        this.#update();
    }

    // TODO: Ideally this would use something like DOMTokenList.
    /** @return {ReadonlyArray} */
    get disabledCards() {
        return this.#disabledCards;
    }
    set disabledCards(disabledCards) {
        this.#disabledCards = disabledCards;
        this.#update();
    }

    connectedCallback() {
        this.#suitValue = this.getAttribute('suit');
        this.#rankValue = this.getAttribute('rank');

        const form = document.createElement('form');
        this.append(form);

        const suitsContainer = document.createElement('div');
        suitsContainer.classList.add('suits');
        form.append(suitsContainer);

        SUITS.forEach((suit) => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'suit';
            input.value = suit;
            input.ariaLabel = suit;
            input.addEventListener('change', () => {
                this.suit = suit;
            });

            const icon = document.createElement('span');
            icon.innerText = SUIT_SYMBOLS[suit];

            const label = document.createElement('label');
            label.title = suit;
            label.classList.add(SUIT_COLORS[suit]);
            label.append(icon, input);

            label.addEventListener('pointerdown', () => {
                input.click();
            });

            suitsContainer.append(label);
        });

        const ranksContainer = document.createElement('div');
        ranksContainer.classList.add('ranks');
        form.append(ranksContainer);

        RANKS.forEach((rank) => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'rank';
            input.value = rank;
            input.addEventListener('change', () => {
                this.rank = rank;
            });

            const card = document.createElement('playing-card');
            card.setAttribute('suit', SUITS[0])
            card.setAttribute('rank', rank);
            card.setAttribute('borderline', '0');
            card.setAttribute('borderradius', '0');
            card.setAttribute('bordercolor', 'transparent');

            const label = document.createElement('label');
            label.title = rank;
            label.append(card, input);

            label.addEventListener('pointerdown', () => {
                input.click();
            });

            ranksContainer.append(label);
        });

        const guessButton = document.createElement('button');
        guessButton.innerText = 'Make guess';
        ranksContainer.append(guessButton);

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const suit = formData.get('suit');
            const rank = formData.get('rank');

            const event = new CustomEvent('guess', {
                detail: {
                    suit,
                    rank,
                },
            });
            this.dispatchEvent(event);

            // Deselect guessed card
            const checkedRankInput = this.querySelector('input[name=rank]:checked');
            if (checkedRankInput) {
                checkedRankInput.checked = false;
            }

            this.#update();
        });

        this.#update();
    }

    #update() {
        /** @type {NodeListOf<HTMLInputElement>} */
        const suitInputs = this.querySelectorAll('input[name=suit]');
        suitInputs.forEach((suitInput) => {
            // Update checked state
            suitInput.checked = suitInput.value === this.suit;
        });

        /** @type {NodeListOf<HTMLInputElement>} */
        const rankInputs = this.querySelectorAll('input[name=rank]');
        rankInputs.forEach((rankInput) => {
            // Update disabled state
            rankInput.disabled = this.suit === null || this.#disabledCards.includes(`${rankInput.value}-of-${this.suit}`);
            if (rankInput.value === this.rank && rankInput.disabled) {
                this.#rankValue = null;
            }

            // Update checked state
            rankInput.checked = rankInput.value === this.rank;

            const label = rankInput.parentElement;
            const card = label.querySelector('playing-card');

            // Update card art
            if (rankInput.disabled) {
                card.setAttribute('suit', '');
                card.setAttribute('rank', '0');
            } else {
                card.setAttribute('suit', this.suit);
                card.setAttribute('rank', rankInput.value);
            }

            // Update labels
            let title = `${rankInput.value} of ${this.suit}`;
            if (rankInput.disabled) {
                title += ' (flipped)';
            }
            label.title = title;
            rankInput.ariaLabel = title;
            card.querySelector('img')?.setAttribute('alt', title);
        });

        const guessButton = this.querySelector('button');
        guessButton.disabled = this.rank === null || this.suit === null;
    }
}

customElements.define('card-select', CardSelect);
