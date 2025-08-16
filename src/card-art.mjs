class CardArt extends HTMLElement {
    #playingCard = document.createElement('playing-card');

    /** @type {'back'|'front'} */
    #face;
    /** @type {string|null} */
    #suit;
    /** @type {string|null} */
    #rank;

    get face() {
        return this.#face;
    }

    set face(value) {
        this.#face = value;
        this.#updatePlayingCard();
    }

    get suit() {
        return this.#suit;
    }

    set suit(value) {
        this.#suit = value;
        this.#updatePlayingCard();
    }

    get rank() {
        return this.#rank;
    }

    set rank(value) {
        this.#rank = value;
        this.#updatePlayingCard();
    }

    connectedCallback() {
        this.#updatePlayingCard();
        this.#updatePlayingCardColors();
        this.#playingCard.setAttribute('shadow', '0,0,0');
        this.#playingCard.setAttribute('borderline', '0');
        this.#playingCard.setAttribute('borderradius', '0');
        this.#playingCard.setAttribute('bordercolor', 'transparent');
        this.append(this.#playingCard);

        // Update colors when theme changes.
        const observer = new MutationObserver(() => {
            this.#updatePlayingCardColors();
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });
    }

    #updatePlayingCard() {
        const img = this.#playingCard.querySelector('img');

        if (this.face === 'back') {
            this.#playingCard.removeAttribute('suit');
            this.#playingCard.setAttribute('rank', 'back');
            img?.setAttribute('alt', 'Playing card back');
        } else {
            this.#playingCard.setAttribute('suit', this.suit);
            this.#playingCard.setAttribute('rank', this.rank);
            img?.setAttribute(
                'alt',
                `Playing card: ${this.rank} of ${this.suit}`,
            );
        }
    }

    #updatePlayingCardColors() {
        const computedStyle = window.getComputedStyle(this);
        const bg = computedStyle.getPropertyValue('--card-bg');
        const back = computedStyle.getPropertyValue('--card-back');
        const opacity = computedStyle.getPropertyValue('--card-opacity');
        const suitRed = computedStyle.getPropertyValue('--card-suit-red');
        const suitBlack = computedStyle.getPropertyValue('--card-suit-black');
        const courtRed = computedStyle.getPropertyValue('--card-court-red');
        const courtBlack = computedStyle.getPropertyValue('--card-court-black');
        const courtBlue = computedStyle.getPropertyValue('--card-court-blue');
        const courtGold = computedStyle.getPropertyValue('--card-court-gold');
        const courtLineWidth = computedStyle.getPropertyValue(
            '--card-court-linewidth',
        );

        this.#playingCard.setAttribute('cardcolor', bg);
        this.#playingCard.setAttribute('backcolor', back);
        this.#playingCard.setAttribute('opacity', opacity);
        this.#playingCard.setAttribute(
            'courtcolors',
            `${courtGold},${courtRed},${courtBlue},${courtBlack},${courtBlack},${courtLineWidth}`,
        );
        this.#playingCard.setAttribute(
            'suitcolor',
            `${suitBlack},${suitRed},${suitRed},${suitBlack}`,
        );
        this.#playingCard.setAttribute(
            'rankcolor',
            `${suitBlack},${suitRed},${suitRed},${suitBlack}`,
        );
    }
}

window.customElements.define('card-art', CardArt);
