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
        this.#playingCard.setAttribute('borderline', '0');
        this.#playingCard.setAttribute('borderradius', '0');
        this.#playingCard.setAttribute('bordercolor', 'transparent');
        this.append(this.#playingCard);
    }

    #updatePlayingCard() {
        const img = this.#playingCard.querySelector('img');

        if (this.face === 'back') {
            this.#playingCard.removeAttribute('suit')
            this.#playingCard.setAttribute('rank', 'back');
            img?.setAttribute('alt', 'Playing card back');
        } else {
            this.#playingCard.setAttribute('suit', this.suit)
            this.#playingCard.setAttribute('rank', this.rank);
            img?.setAttribute('alt', `Playing card: ${this.rank} of ${this.suit}`);
        }
    }
}

window.customElements.define('card-art', CardArt);
