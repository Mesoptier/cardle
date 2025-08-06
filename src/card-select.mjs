import {RANKS, SUIT_COLORS, SUIT_SYMBOLS, SUITS} from './constants.mjs';

class CardSelect extends HTMLElement {
    connectedCallback() {
        const form = this.shadowRoot.querySelector('form');

        const suitsContainer = this.shadowRoot.querySelector('.suits');
        SUITS.forEach((suit) => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'suit';
            input.value = suit;
            input.ariaLabel = suit;

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
            input.ariaLabel = rank;
            input.disabled = true; // Rank selection is disabled until a suit is selected

            const card = document.createElement('playing-card');
            card.setAttribute('rank', '0');
            card.setAttribute('borderline', '0');
            card.setAttribute('borderradius', '0');

            const label = document.createElement('label');
            label.title = rank;
            label.append(card, input);

            ranksContainer.append(label);
        });

        const guessButton = document.createElement('button');
        guessButton.innerText = 'Make guess';
        guessButton.disabled = true;
        ranksContainer.append(guessButton);

        const suitInputs = suitsContainer.querySelectorAll('input');
        const rankInputs = ranksContainer.querySelectorAll('input');

        suitInputs.forEach((suitInput) => {
            suitInput.addEventListener('change', () => {
                rankInputs.forEach((rankInput) => {
                    const label = rankInput.parentElement;
                    const card = label.querySelector('playing-card');

                    const suit = suitInput.value;
                    const rank = rankInput.value;

                    card.setAttribute('suit', suit);
                    card.setAttribute('rank', rank);
                    label.title = `${rank} of ${suit}`;
                    rankInput.ariaLabel = `${rank} of ${suit}`;
                    rankInput.disabled = false;
                });
            });
        });

        rankInputs.forEach((rankInput) => {
            rankInput.addEventListener('change', () => {
                guessButton.disabled = false;
            });
        });

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
        });
    }
}

customElements.define('card-select', CardSelect);
