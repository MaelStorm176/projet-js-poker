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

const cards = {
    cards_croup: {
        carteCache: { //carte de gauche croupier
            id: "carteCache",
            x: "312.5",
            y: "122.37"
        },
        carte2_croup: { //carte de droite croupier
            id: "carte2_croup",
            x: "394",
            y: "122.37"
        }
    },
    cards_player: {
        carte1: { //carte de gauche joueur
            id: "carte1",
            x: "314.5",
            y: "381.37"
        },
        carte2: { //carte de droite joueur
            id: "carte2",
            x: "395.5",
            y: "381.37"
        }
    }
}

game.pPromise.then(async () => {
    //On initialise les deux cartes de départ
    try{
        await game.drawNewCard(
            cards.cards_player.carte1.id,
            cards.cards_player.carte1.x,
            cards.cards_player.carte1.y,
            false
        );
    }catch (e) {
        game.error(e);
    }

    try{
        await game.drawNewCard(
            cards.cards_player.carte2.id,
            cards.cards_player.carte2.x,
            cards.cards_player.carte2.y,
            false
        );
    }catch (e) {
        game.error(e);
    }

    try {
        await game.drawNewCard(
            cards.cards_croup.carte2_croup.id,
            cards.cards_croup.carte2_croup.x,
            cards.cards_croup.carte2_croup.y,
            true
        );
    } catch (e) {
        game.error(e);
    }

    // EVENTS LISTENER
    new_card.addEventListener("click", async function () {
        try {
            await game.drawNewCard(
                cards.cards_player.carte1.id,
                cards.cards_player.carte1.x,
                cards.cards_player.carte1.y,
                false
            );
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
                await game.drawNewCard(
                    cards.cards_croup.carteCache.id,
                    cards.cards_croup.carteCache.x,
                    cards.cards_croup.carteCache.y,
                    true
                );
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
                await game.drawNewCard(
                    cards.cards_player.carte1.id,
                    cards.cards_player.carte1.x,
                    cards.cards_player.carte1.y,
                    false
                ); // On tire une carte
            } catch (e) {
                game.error(e);
            }
        }
        if (event.key === 'c') {
            // annuler le tirage
        }
    });
});