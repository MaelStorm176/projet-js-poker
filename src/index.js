import { Game } from "./class/Game.js"
import {setup, sleep} from "../librairies/setup.js"
setup();
const new_card = document.getElementById("deck");
const shuffle = document.getElementById("shuffle");
const victory = document.getElementById("victory");

//Initialisation du jeu

const game = new Game(
    "started",
    0,
    false,
    "score", //Le span de score
    "carte_rest", //La div où on affiche le nb de cartes restantes
    "score_croupier", //La div où on affiche le score du croupier
    0
);
game.pPromise.then(() => {
    //On initialise les deux cartes de départ
    game.drawNewCard('carte1', "314.5", "381.37");
    game.drawNewCard('carte2', "395.5", "381.37");

    game.drawNewCardCroup('carte2_croup', "394", "122.37");

    // EVENTS LISTENER
    new_card.addEventListener("click", function() {
        game.drawNewCard('carte1', "315.5", "381.37");
    });

    shuffle.addEventListener("click", function() {
        game.shuffleDeck();
    }, false);

    victory.addEventListener("click", async function () {
        while(game.state !== "end"){
            try {
                await game.drawNewCardCroup('carteCache', "312.5", "122.37");
            } catch (e) {
                console.log(e);
            }
            await sleep(1000);
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'd') {
            game.drawNewCard('carte1',"315.5", "381.37"); // On tire une carte
        }
        if (event.key === 'c') {
            // annuler le tirage
        }
    });
});