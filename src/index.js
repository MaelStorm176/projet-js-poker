//import shuffleDeck from "./librairies/shuffle.js";
import {Game} from "./class/Game.js"
const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
let url_shuffle;
let url_draw_1;
let game = new Game("started",0,[],[]); //Le jeu

const span_score = document.getElementById("score");
const div_cartes = document.getElementById("add_card");
const carte_rest = document.getElementById("carte_rest");

const value = {
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
    textScoreX.innerText = "Valeur = "+value[scoreX];

    /**** AJOUT IMAGE ****/
    newImg.src = card.image;
    new_div_image.appendChild(newImg);
    new_div_image.appendChild(textScoreX);
    div_cartes.appendChild(new_div_image);
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

function keyboardPress() {
    document.addEventListener('keydown', function (event) {
        if (event.key === 'd') {
            drawNewCard(); // On tire une carte
        }
        if (event.key === 'c') {
            // annuler le tirage
        }
    });
}

drawNewCard();
drawNewCard();
