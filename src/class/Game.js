import { CardApi } from './CardApi.js'

export class Game extends CardApi {

    /**
     * Constructeur de la classe Game
     * @param state * Etat de la partie ["started","win","loose","end"]
     * @param score_joueur * Score du joueur
     * @param dev   * Mode developpeur
     * @param score_croupier * Score du croupier
     * @param url_draw_1
     * @param url_shuffle
     */
    constructor(state, score_joueur, dev, score_croupier, url_draw_1 = null, url_shuffle = null) {
        super(url_draw_1, url_shuffle);
        this.state = state;
        this.score = score_joueur;
        this.dev = dev; //Debugging en mode dev
        this.scoreC = score_croupier;
        this.created_at = Date.now();
        this.game_id = "game-" + this.created_at.toString();
        this.last_cards = {};
        this.remainingCards = null;
    }


    /**
     * Test jeu fini joueur
     * @returns {boolean}
     */
    isFinishPlayer() {
        //Si on est en mode dev
        if (this.dev === true)
            return false;
        if (this.score > 21) {
            this.state = "loose";
            return true;
        } else if (this.score === 21) {
            this.state = "win";
            return true;
        } else if (this.score < 21 && this.state === "stopped") {
            this.state = "win";
            return true;
        } else {
            this.state = "started";
            return false;
        }
    }

    /**
     * Test jeu fini croupier s'il dépasse 21
     * @returns {boolean}
     */
    isFinishCroupier() {
        if (this.state === "started") {
            if (this.score < this.scoreC && this.scoreC <= 21) {
                this.state = "loose";
                return true;
            } else if (this.score < this.scoreC && this.score < 21) {
                this.state = "win";
                return true;
            } else {
                this.state = "started";
                return false;
            }
        }
    }

    /**
     * Tirer nouvelle carte joueur
     * @param id
     * @param x
     * @param y
     * @param croup * true | false croupier oui/non
     * @returns {Promise<void>}
     */
    async drawNewCard(id, x, y, croup) {
        await this.getNewCard()
            .then((card) => {
                    this.createDivCard(card.image, id, x, y);

                    /** REMAINING CARDS **/
                    this.remainingCards = card.remaining;
                    this.displayRemainingCards();

                    /** UPDATE SCORES **/
                    if (croup === true) {
                        this.updateScoreCroupier(card);
                        this.last_cards["croupier"] = card.image;
                    } else if (croup === false) {
                        this.updateScoreJoueur(card);
                        this.last_cards["player"] = card.image;
                    }
                    this.displayScores();

                    /**** RETEST SI ON A GAGNE/PERDU ****/
                    if ((croup === false && this.isFinishPlayer()) || (croup === true && this.isFinishCroupier())) {
                        let scoreboard = this.getScoreboard(); //On recupère les parties stockées dans le localstorage

                        this.store(); // On sauvegarde notre partie dans le localstorage
                        window.navigator.vibrate([1000, 1000, 2000]);
                        this.majModal(scoreboard);
                        this.state = "end";
                    }
                }
            ).catch((error) => {
                console.log(error);
            });
    }

    /**
     * Met à jour le score du joueur en fonction de la carte tirée
     * @param card
     */
    updateScoreJoueur(card) {
        if (card.code !== undefined)
            this.score += this.value[card.code.charAt(0)];
        else
            this.error("Bad card object");
    }

    /**
     * Affiche le score du joueur sur le plateau de jeu
     */
    displayScoreJoueur() {
        this.span_score.textContent = "Score : " + this.score;
    }

    /**
     * Met à jour le score du croupier en fonction de la carte tirée
     * @param card
     */
    updateScoreCroupier(card) {
        if (card.code !== undefined)
            this.scoreC += this.value[card.code.charAt(0)];
        else
            this.error("Bad card object");
    }

    /**
     * Affiche le score du croupier sur le plateau de jeu
     */
    displayScoreCroupier() {
        this.score_croupier.textContent = "Score : " + this.scoreC;
    }

    /**
     * Affiche le score du croupier et du joueur
     */
    displayScores(){
        this.displayScoreCroupier();
        this.displayScoreJoueur();
    }

    /**
     * Affiche le nombre de cartes restantes
     */
    displayRemainingCards(){
        this.carte_rest.textContent = "Remaining cards : "+this.remainingCards;
    }

    /**
     * Affiche le modal de résultats avec les scores du joueur + croupier
     */
    majModal(scoreboard) {
        let modal = document.getElementById("myModal");
        document.getElementById("result").textContent += this.state;
        document.getElementById("scoreJ").textContent += this.score;
        document.getElementById("scoreCr").textContent += this.scoreC;
        const scoreboard_table_body = document.getElementById('scoreboard');

        for (const [key, value] of Object.entries(scoreboard)) {
            if (value !== null) {
                let created_at = new Date(value.created_at);

                let row = scoreboard_table_body.insertRow();
                row.insertCell(0).innerText = created_at.toLocaleDateString("fr-FR");
                row.insertCell(1).innerText = value.state;
                row.insertCell(2).innerText = value.scoreC;
                row.insertCell(3).innerText = value.score;
                if (value.state === "started") {
                    let cell = row.insertCell(4);
                    cell.innerHTML = "<button>Continuer</button>";
                    cell.addEventListener("click", event => {
                        Game.reload(value.game_id)
                    });
                } else
                    row.insertCell(4).innerHTML = "";
            }
        }
        modal.style.display = "block";
    }


    /**
     * Retourne le tableau Scoreboard
     * @returns {*[]}
     */
    getScoreboard() {
        let scoreboard = [];
        let key;
        if (window.localStorage.length > 0) {
            for (let i = 0; i < localStorage.length; i++) {
                key = localStorage.key(i);
                scoreboard[key] = Game.jsonDecode(localStorage.getItem(key));
            }
        }
        //On trie les parties par date
        scoreboard.sort((a, b) => {
            if (a.created_at > b.created_at)
                return 1
            if (a.created_at < b.created_at)
                return -1
            return 0
        });
        return scoreboard;
    }


    /**
     * Gestion des errerus lors du jeu
     * @param e
     */
    error(e) {
        console.error(e);
        this.state = "ERROR";
        this.majModal();
    }

    /**
     * Enregistre l'objet game dans le local storage
     */
    store() {
        window.localStorage.setItem(this.game_id, Game.jsonEncode(this));
    }

    /**
     * Decode un JSON en objet GAME
     * @returns {Game|null}
     * @param {string} game_encoded
     */
    static jsonDecode(game_encoded) {
        const game_decoded = JSON.parse(game_encoded);
        return game_decoded;
        /*
        if (game_decoded instanceof Game){
            return game_decoded;
        }else{
            return null;
        }*/
    }

    /**
     * Encode en JSON un objet GAME
     * @param {Game} game_decoded
     * @returns {string|null}
     */
    static jsonEncode(game_decoded) {
        const game_encoded = JSON.stringify(game_decoded);
        if (game_encoded !== "") {
            return game_encoded
        } else {
            return null;
        }
    }

    /**
     *
     * @param game_id
     * @returns {Game|null}
     */
    static load(game_id) {
        const game_encoded = window.localStorage.getItem(game_id);
        if (window.localStorage.getItem(game_id) !== null) {
            const game_decoded = Game.jsonDecode(game_encoded);
            const game = new Game(
                game_decoded.state,
                game_decoded.score,
                game_decoded.dev,
                game_decoded.scoreC,
                game_decoded.url_draw_1,
                game_decoded.url_shuffle
            );
            game.last_cards = game_decoded.last_cards;
            game.created_at = game_decoded.created_at;
            game.game_id = game_decoded.game_id;
            game.remainingCards = game_decoded.remainingCards;
            return game;
        } else {
            return null;
        }
    }

    /**
     * Permet de rediriger vers une partie déja en cours
     * @param game_id
     */
    static reload(game_id = null) {
        let url = window.location.href;
        if (game_id !== null) {
            if (window.location.search !== "") {
                url = window.location.origin + '?game_id=' + game_id
            } else {
                if (url.indexOf('?') > -1) {
                    url = window.location.origin;
                } else {
                    url = window.location.origin + '?game_id=' + game_id;
                }
            }
        }
        window.location.replace(url);
    }

}