//import shuffleDeck from "./librairies/shuffle.js";
import {Game} from "./class/Game.js"
const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
let url_shuffle;
let url_draw_1;
let game = new Game("started",0,[],[]); //Le jeu

const span_score = document.getElementById("score");
const div_cartes = document.getElementById("add_card");
const carte_rest = document.getElementById("carte_rest");

//On récupère l'id du deck et on initialise les url "shuffle" et "draw"
await fetch(url)
    .then((response) => response.json())
    .then((data) => {
        url_shuffle = `https://deckofcardsapi.com/api/deck/${data.deck_id}/shuffle/?remaining=true`;
        url_draw_1 = `https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=1`;
    });

export async function shuffleDeck() {
    const response = await fetch(url_shuffle);
    const shuffle = await response.json();
    console.log(shuffle);
    return shuffle;
}

function createDivCard(card) {
    const new_div_image = document.createElement("div");
    const newImg = new Image(150, 200);
    newImg.style.transform = "rotate(-10deg)";

    /**** SCORE DE LA CARTE ****/
    let scoreX = card.code.charAt(0);
    let textScoreX = document.createElement("p");

    /**** AJOUT IMAGE ****/
    newImg.src = card.image;
    new_div_image.appendChild(newImg);
    div_cartes.appendChild(newImg);
}

export function drawNewCard() {
    fetch(url_draw_1)
        .then((response) => response.json())
        .then((data) => {
            createDivCard(data.cards[0]);

            /**** SCORE ****/
            game.score += value[data.cards[0].code.charAt(0)];
            span_score.innerText = game.score;

            /**** CARTES RESTANTES ****/
            carte_rest.innerText = data.remaining;

            if (game.isFinish()){
                alert(`Le jeu est fini : ${game.state}`);
            }
    });
}

drawNewCard();
drawNewCard();
