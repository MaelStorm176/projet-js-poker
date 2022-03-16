import {drawCard} from "../../librairies/setup.js"

export class CardApi {
    url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
    url_shuffle;
    url_draw_1;

    value = {
        "A": 0,
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "0": 10,
        "J": 10,
        "Q": 10,
        "K": 10
    }

    /**
     * Constructeur
     * @param span_score * Span où s'affiche le score du joueur
     * @param carte_rest * Span où le nb de cartes restantes s'affiche
     * @param score_croupier * Span où le score du croupier s'affiche
     */
    constructor(span_score, carte_rest, score_croupier) {
        this.span_score = document.getElementById("score");
        this.carte_rest = document.getElementById("carte_rest");
        this.score_croupier = document.getElementById("score_croupier");
        this.initUrls();
    }

    /**
     * Initialise les url Shuffle / Draw
     * @returns {Promise<void>}
     */
    async initUrls() {
        //On récupère l'id du deck et on initialise les url "shuffle" et "draw"
        this.pPromise = fetch(this.url)
            .then((response) => response.json())
            .then((data) => {
                this.url_shuffle = `https://deckofcardsapi.com/api/deck/${data.deck_id}/shuffle/?remaining=true`;
                this.url_draw_1 = `https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=1`;
            });
    }

    /**
     * Mélange le deck
     * @returns {Promise<any>}
     */
    async shuffleDeck() {
        const response = await fetch(this.url_shuffle);
        return await response.json();
    }

    createDivCard(card, id, x, y) {
        let new_image = drawCard(card.image, x, y);
        document.getElementById(id).parentNode.insertBefore(new_image, document.getElementById(id).nextSibling);
        new_image.animate(
            [
                // keyframes
                { transform: 'translateY(-300px)' },
                { transform: 'translateY(0px)' }
            ], {
                // timing options
                duration: 1000,
                iterations: 1
            }
        );
    }

    createDivCardCroup(card, id, x, y) {
        /**** AJOUT IMAGE ****/
        let new_image = drawCard(card.image, x, y)
        new_image.style.zIndex = "1";
        document.getElementById(id).parentNode.insertBefore(new_image, document.getElementById(id).nextSibling);
        new_image.animate(
            [
                // keyframes
                { transform: 'translateY(-300px)' },
                { transform: 'translateY(0px)' }
            ], {
                // timing options
                duration: 1000,
                iterations: 1
            }
        );
    }

    /**
     * Tire 1 carte
     * @returns {Promise<*>}
     */
    async getNewCard() {
        let card;
        await fetch(this.url_draw_1)
            .then((response) => response.json())
            .then((data) => {
                this.carte_rest.setAttribute('style', 'white-space: pre;');
                this.carte_rest.textContent = "Carte restante: " + data.remaining;
                card = data.cards[0];
            });
        return card;
    }
}