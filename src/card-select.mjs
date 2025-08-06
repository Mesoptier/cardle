import {RANKS, SUIT_COLORS, SUIT_SYMBOLS, SUITS} from './constants.mjs';

class CardSelect extends HTMLElement {
    #disabledCards = new Set();

    connectedCallback() {
        const form = this.shadowRoot.querySelector('form');

        const suitsContainer = this.shadowRoot.querySelector('.suits');
        SUITS.forEach((suit, index) => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'suit';
            input.value = suit;
            input.ariaLabel = suit;
            input.addEventListener('change', () => {
                this.update();
            });

            if (index === 0) {
                input.checked = true;
            }

            const icon = document.createElement('span');
            icon.innerText = SUIT_SYMBOLS[suit];

            const label = document.createElement('label');
            label.title = suit;
            label.classList.add(SUIT_COLORS[suit]);
            label.append(icon, input);

            suitsContainer.append(label);
        });

        const ranksContainer = this.shadowRoot.querySelector('.ranks');
        RANKS.forEach((rank) => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'rank';
            input.value = rank;
            input.addEventListener('change', () => {
                this.update();
            });

            const card = document.createElement('playing-card');
            card.setAttribute('suit', SUITS[0])
            card.setAttribute('rank', rank);
            card.setAttribute('borderline', '0');
            card.setAttribute('borderradius', '0');

            const label = document.createElement('label');
            label.title = rank;
            label.append(card, input);

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
            const checkedRankInput = this.shadowRoot.querySelector('input[name=rank]:checked');
            if (checkedRankInput) {
                checkedRankInput.checked = false;
            }
        });

        this.update();
    }

    update() {
        const form = this.shadowRoot.querySelector('form');
        /** @type {NodeListOf<HTMLInputElement>} */
        const rankInputs = this.shadowRoot.querySelectorAll('input[name=rank]');
        const guessButton = this.shadowRoot.querySelector('button');

        const formData = new FormData(form);
        /** @type {string|null} */
        const rank = formData.get('rank');
        /** @type {string|null} */
        const suit = formData.get('suit');

        rankInputs.forEach((rankInput) => {
            const rank = rankInput.value;
            const label = rankInput.parentElement;
            const card = label.querySelector('playing-card');

            rankInput.disabled = suit === null || this.#disabledCards.has(`${rank}-of-${suit}`);

            if (rankInput.disabled) {
                rankInput.checked = false;
                card.setAttribute('suit', '');
                card.setAttribute('rank', '0');
            } else {
                card.setAttribute('suit', suit);
                card.setAttribute('rank', rank);
            }

            let title = `${rank} of ${suit}`;
            if (rankInput.disabled) {
                title += ' (flipped)';
            }
            label.title = title;
            rankInput.ariaLabel = title;
            card.querySelector('img')?.setAttribute('alt', title);
        });

        guessButton.disabled = rank === null || suit === null;
    }

    disableCard(cid) {
        this.#disabledCards.add(cid);
        this.update();
    }
}

customElements.define('card-select', CardSelect);
