import { Game } from "./class/Game.js"
import {setup, sleep, getSearchParameters} from "../librairies/setup.js"
setup();

/**
 * Les parametres passés en GET dans l'url
 * @type {{}|{}}
 */
const url_params = getSearchParameters();
console.log(url_params);

/**
 * Le deck en haut à gauche
 * @type {HTMLElement}
 */
const new_card = document.getElementById("deck");

/**
 * Le bouton mélanger
 * @type {HTMLElement}
 */
const shuffle = document.getElementById("shuffle");

/**
 * Le bouton pour stopper la partie
 * @type {HTMLElement}
 */
const stop_game = document.getElementById("stop-game");

/**
 * Le bouton pour stopper la partie
 * @type {HTMLElement}
 */
const exit_game = document.getElementById("exit-game");

/**
 * Le bouton dans la modale pour relancer une partie
 * @type {HTMLElement}
 */
const reroll = document.getElementById("reroll");

/**
 * Image connecté à internet
 * @type {HTMLElement}
 */
const img_connected = document.getElementById("img_connected");

/**
 * Image déconnecté de internet
 * @type {HTMLElement}
 */
const img_disconnected = document.getElementById("img_disconnected");


/**
 * Emplacements et id des decks
 * @type {{cards_croup: {carteCache: {x: string, y: string, id: string}, carte2_croup: {x: string, y: string, id: string}}, cards_player: {carte1: {x: string, y: string, id: string}, carte2: {x: string, y: string, id: string}}}}
 */
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

/**
 * Initialisation du jeu
 * @type {Game|null}
 */
let game = null;
if (url_params["game_id"] !== undefined && Game.load(url_params["game_id"]) !== null){
    game = Game.load(url_params["game_id"]);
    console.log(game);
}
else{
    game = new Game(
        "started",
        0,
        false,
        "score", //Le span de score
        "carte_rest", //La div où on affiche le nb de cartes restantes
        "score_croupier", //La div où on affiche le score du croupier
        0
    );
}


/**
 * EVENTS
 */
window.addEventListener('online', function(e) {
    img_connected.style.display = "block";
    img_disconnected.style.display = "none";
});
window.addEventListener('offline', function(e) {
    img_connected.style.display = "none";
    img_disconnected.style.display = "block";
});

/**
 * GESTION DU JEU
 */
game.pPromise.then(async () => {
    /** INITIALISATION DEUX CARTES DE DEPART JOUEUR **/
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

    /** INITIALISATION PREMIERE CARTE CROUPIER **/
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

    /** EVENTS LISTENER **/
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

    /** SHUFFLE LE DECK **/
    shuffle.addEventListener("click", function () {
        game.shuffleDeck().then(r => {
            //ANIMATION DU DECK A FAIRE ICI
        });
    });

    /** STOPPER LE JEU **/
    stop_game.addEventListener("click", async function () {
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

    /** QUITTER LE JEU **/
    exit_game.addEventListener("click", function (){
        const scoreboard = game.getScoreboard();
        console.log(scoreboard);
        game.majModal(scoreboard);
        game.store();
        window.navigator.vibrate([1000, 1000, 2000]);
    });

    /** LANCER UNE NOUVELLE PARTIE **/
    reroll.addEventListener("click", function () {
        location.reload();
    });

    /** d = Tirer une nouvelle carte joueur | c = Annuler tirage **/
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
})
.catch((error) => {
    console.error(error);
});