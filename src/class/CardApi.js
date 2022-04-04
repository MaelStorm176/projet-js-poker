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
     * @param url_draw_1
     * @param url_shuffle
     */
    constructor(url_draw_1=null, url_shuffle=null) {
        this.span_score = document.getElementById("score");
        this.carte_rest = document.getElementById("carte_rest");
        this.score_croupier = document.getElementById("score_croupier");
        if (url_draw_1 === null || url_shuffle === null){
            this.initUrls();
        }
        else{
            this.url_shuffle = url_shuffle;
            this.url_draw_1 = url_draw_1;
        }
    }

    /**
     * Initialise les url Shuffle / Draw
     * @returns {Promise<void>}
     */
    async initUrls() {
        //On récupère l'id du deck et on initialise les url "shuffle" et "draw"
        this.pPromise = fetch(this.url)
            .then((response) => {
                if (response.ok)
                    return response.json();
                else
                    throw new Error('CardAPI communication error');
            })
            .then((data) => {
                if (data.deck_id){
                    this.url_shuffle = `https://deckofcardsapi.com/api/deck/${data.deck_id}/shuffle/?remaining=true`;
                    this.url_draw_1 = `https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=1`;
                }else{
                    throw new Error("Deck's id unknown");
                }
            })
            .catch((error) => {
                throw error;
            });
    }

    /**
     * Mélange le deck
     * @returns {Promise<any>}
     */
    async shuffleDeck() {
        await fetch(this.url_shuffle).then((response) => {
            if (response.ok)
                return response.json();
            else
                throw new Error('Shuffle deck error');
        }).catch((error) => {
            throw error;
        });
    }

    /**
     * A partir d'une carte retourner par l'API, la fonction va créer la div représentant la carte et l'animer
     * @param card_image
     * @param id
     * @param x
     * @param y
     */
    createDivCard(card_image, id, x, y) {
        let new_image = drawCard(card_image, x, y);
        document.getElementById(id).parentNode.append(new_image);
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
            .then((response) => {
                if (response.ok)
                    return response.json();
                else
                    throw new Error('CardAPI communication error');
            })
            .catch((reason) => {
                throw reason;
            })
            .then((data) => {
                card = data.cards[0];
                card.remaining = data.remaining;
            })
            .catch((error) => {
                throw error;
            });
        return card;
    }
}