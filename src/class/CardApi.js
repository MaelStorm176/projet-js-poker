import {DrawCardJoueur, setupDrawCardJoueur} from "../../librairies/setup.js"

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

    constructor(span_score, carte_rest, score_croupier) {
        this.span_score = document.getElementById("score");
        this.carte_rest = document.getElementById("carte_rest");
        this.score_croupier = document.getElementById("score_croupier");
        this.initUrls();
    }

    async initUrls() {
        //On récupère l'id du deck et on initialise les url "shuffle" et "draw"
        this.pPromise = fetch(this.url)
            .then((response) => response.json())
            .then((data) => {
                this.url_shuffle = `https://deckofcardsapi.com/api/deck/${data.deck_id}/shuffle/?remaining=true`;
                this.url_draw_1 = `https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=1`;
            });
    }

    async shuffleDeck() {
        const response = await fetch(this.url_shuffle);
        return await response.json();
    }

    createDivCard(card, id, x, y) {
        /*const new_div_image = document.createElement("div");
        //new_div_image.style.position = "absolute";
        const newImg = new Image(150, 200);
        newImg.style.transform = "rotate(-10deg)";*/

        /**** SCORE DE LA CARTE ****/
        /*let scoreX = card.code.charAt(0);
        let textScoreX = document.createElement("p");
        textScoreX.innerText = "Valeur = " + this.value[scoreX];*/

        /**** AJOUT IMAGE ****/
        //newImg.src = card.image;
        console.log(id);
        console.log(card);
        let new_image = DrawCardJoueur(card.image, x, y)

        document.getElementById(id).parentNode.insertBefore(new_image, document.getElementById(id));
        //new_div_image.appendChild(textScoreX);
        //this.div_cartes.appendChild(document.getElementById(id));
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
        let new_image = setupDrawCardJoueur(card.image, x, y)
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