import { Game } from "./class/Game.js"
import { setup } from "../librairies/setup.js"
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
    "add_card", //La div où les cartes s'ajoutent
    "carte_rest" //La div où on affiche le nb de cartes restantes
);
game.pPromise.then(() => {
    //On initialise les deux cartes de départ
    game.drawNewCard('carte1', "314.5", "381.37");
    game.drawNewCard('carte2', "395.5", "381.37");

    // EVENTS LISTENER
    new_card.addEventListener("click", function() {
        game.drawNewCard('carte1', 315.5, "381.37");
    });
    shuffle.addEventListener("click", function() {
        game.shuffleDeck();
    }, false);
    victory.addEventListener("click", function() {
        game.stopGame();
        console.log(game.state);
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'd') {
            game.drawNewCard(); // On tire une carte
        }
        if (event.key === 'c') {
            // annuler le tirage
        }
    });
});