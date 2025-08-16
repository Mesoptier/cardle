import { RANKS, SUIT_COLORS, SUIT_SYMBOLS, SUITS } from './constants.mjs';

class CardSelect extends HTMLElement {
    /** @type {string|null} */
    #suitValue;
    /** @type {string|null} */
    #rankValue;
    // TODO: Ideally this would use something like DOMTokenList.
    /** @type {ReadonlyArray<string>} */
    #disabledCards = [];
    /** @type boolean */
    #readOnly = false;

    get suit() {
        return this.#suitValue;
    }

    set suit(value) {
        this.#suitValue = value;
        this.#update();
    }

    get rank() {
        return this.#rankValue;
    }

    set rank(value) {
        this.#rankValue = value;
        this.#update();
    }

    get disabledCards() {
        return this.#disabledCards;
    }

    set disabledCards(value) {
        this.#disabledCards = value;
        this.#update();
    }

    get readOnly() {
        return this.#readOnly;
    }

    set readOnly(value) {
        this.#readOnly = value;
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
            icon.ariaHidden = 'true';

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

            const cardArt = document.createElement('card-art');
            cardArt.ariaHidden = 'true';

            const label = document.createElement('label');
            label.title = rank;
            label.append(cardArt, input);

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
            const checkedRankInput = this.querySelector(
                'input[name=rank]:checked',
            );
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
            suitInput.checked = suitInput.value === this.suit;
            suitInput.disabled = this.readOnly;
        });

        /** @type {NodeListOf<HTMLInputElement>} */
        const rankInputs = this.querySelectorAll('input[name=rank]');
        rankInputs.forEach((rankInput) => {
            const disabled =
                this.suit === null ||
                this.#disabledCards.includes(
                    `${rankInput.value}-of-${this.suit}`,
                );
            if (rankInput.value === this.rank && disabled) {
                this.#rankValue = null;
            }
            rankInput.checked = rankInput.value === this.rank;
            rankInput.disabled = disabled || this.readOnly;

            const label = rankInput.parentElement;

            // Update card art
            /** @type {CardArt} */
            const cardArt = label.querySelector('card-art');
            if (disabled) {
                cardArt.face = 'back';
            } else {
                cardArt.face = 'front';
                cardArt.suit = this.suit;
                cardArt.rank = rankInput.value;
            }

            // Update labels
            let title = `${rankInput.value} of ${this.suit}`;
            if (disabled) {
                title += ' (flipped)';
            }
            label.title = title;
            rankInput.ariaLabel = title;
        });

        const guessButton = this.querySelector('button');
        guessButton.disabled =
            this.rank === null || this.suit === null || this.readOnly;
    }
}

customElements.define('card-select', CardSelect);
