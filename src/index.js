import { Game } from "./class/Game.js"
import {setup, sleep} from "../librairies/setup.js"
setup();
const new_card = document.getElementById("deck");
const shuffle = document.getElementById("shuffle");
const victory = document.getElementById("victory");
const reroll = document.getElementById("reroll");
const img_connected = document.getElementById("img_connected");
const img_disconnected = document.getElementById("img_disconnected");

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

window.addEventListener('online', function(e) {
    img_connected.style.display = "block";
    img_disconnected.style.display = "none";
});
window.addEventListener('offline', function(e) {
    img_connected.style.display = "none";
    img_disconnected.style.display = "block";
});

game.pPromise.then(async () => {
    //On initialise les deux cartes de départ
    try{
        await game.drawNewCard('carte1', "314.5", "381.37");
    }catch (e) {
        game.error(e);
    }

    try{
        await game.drawNewCard('carte2', "395.5", "381.37");
    }catch (e) {
        game.error(e);
    }

    try {
        await game.drawNewCardCroup('carte2_croup', "394", "122.37");
    } catch (e) {
        game.error(e);
    }

    // EVENTS LISTENER
    new_card.addEventListener("click", async function () {
        try {
            await game.drawNewCard('carte1', "315.5", "381.37");
        } catch (e) {
            game.error(e);
        }
    });

    shuffle.addEventListener("click", function () {
        game.shuffleDeck().then(r => {
            //ANIMATION DU DECK A FAIRE ICI
        });
    });

    victory.addEventListener("click", async function () {
        while (game.state !== "end") {
            try {
                await game.drawNewCardCroup('carteCache', "312.5", "122.37");
            } catch (e) {
                game.error(e);
            }
            await sleep(1000);
        }
    });

    reroll.addEventListener("click", function () {
        location.reload();
    });

    document.addEventListener('keydown', async function (event) {
        if (event.key === 'd') {
            try {
                await game.drawNewCard('carte1', "315.5", "381.37"); // On tire une carte
            } catch (e) {
                game.error(e);
            }
        }
        if (event.key === 'c') {
            // annuler le tirage
        }
    });
});