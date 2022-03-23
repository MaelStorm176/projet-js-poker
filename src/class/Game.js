import { CardApi } from './CardApi.js'

export class Game extends CardApi {

    /**
     *
     * @param state * Etat de la partie ["started","win","loose","end"]
     * @param score * Score du joueur
     * @param dev   * Mode developpeur
     * @param span_score * Le span ou le score s'affiche
     * @param carte_rest * NB de cartes restantes
     * @param score_croupier * Le span du socre du croupier
     * @param scoreC * Score du croupier
     */
    constructor(state, score, dev, span_score, carte_rest, score_croupier, scoreC) {
        super(span_score, carte_rest, score_croupier);
        this.state = state;
        this.score = score;
        this.dev = dev; //Debugging en mode dev
        this.scoreC = scoreC;

        this.created_at =  Date.now();
        this.game_id = "game-"+this.created_at.toString();
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
     * Test jeu fini croupier si il dépasse 21
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
                this.createDivCard(card, id, x, y);

                if (croup === true){
                    this.majScoreCroupier(card);
                }else if(croup === false){
                    this.majScoreJoueur(card);
                }

                /**** RETEST SI ON A GAGNE/PERDU ****/
                if ((croup === false && this.isFinishPlayer()) || (croup === true && this.isFinishCroupier())) {
                    let scoreboard = this.getScoreboard(); //On recupère les parties stockées dans le localstorage
                    //console.log("Scoreboard",scoreboard);

                    this.store(); // On sauvegarde notre partie dans le localstorage
                    window.navigator.vibrate([1000, 1000, 2000]);
                    this.majModal(scoreboard);
                    this.state = "end";
                }
            }
        );
    }

    /**
     * Met à jour le score du joueur en fonction de la carte tiré
     * @param card
     */
    majScoreJoueur(card){
        this.score += this.value[card.code.charAt(0)];
        this.span_score.textContent = "Score : " + this.score;
    }

    /**
     * Met à jour le score du croupier en fonction de la carte tiré
     * @param card
     */
    majScoreCroupier(card){
        this.scoreC += this.value[card.code.charAt(0)];
        this.score_croupier.textContent = "Score : " + this.scoreC;
    }


    /**
     * Affiche la modal de résultats avec les scores du joueur + croupier
     */
    majModal(scoreboard) {
        let modal = document.getElementById("myModal");
        document.getElementById("result").textContent += this.state;
        document.getElementById("scoreJ").textContent += this.score;
        document.getElementById("scoreCr").textContent += this.scoreC;
        const scoreboard_table_body = document.getElementById('scoreboard');

        for (const [key, value] of Object.entries(scoreboard)) {
            if (value !== null){
                let created_at = new Date(value.created_at);

                let row = scoreboard_table_body.insertRow();
                row.insertCell(0).innerText = created_at.toLocaleDateString("fr-FR");
                row.insertCell(1).innerText = value.state;
                row.insertCell(2).innerText = value.scoreC;
                row.insertCell(3).innerText = value.score;
                if (value.state === "started"){
                    let cell = row.insertCell(4);
                    cell.innerHTML = "<button>Continuer</button>";
                    cell.addEventListener("click",event => {Game.reload(this.game_id)});
                }
                else
                    row.insertCell(4).innerHTML = "";
            }
        }

        /*
        for(let i=0; i < scoreboard.length; i++){
            document.getElementById('score'+(i+1)).textContent += data1[i] + " - " + data3[i] + " - " + data2[i];
        }*/

        modal.style.display = "block";
    }


    getScoreboard() {
        let scoreboard = [];
        let key;
        if (window.localStorage.length > 0) {
            for (let i = 0; i < localStorage.length; i++){
                key = localStorage.key(i);
                scoreboard[key] = Game.jsonDecode(localStorage.getItem(key));
            }
        }
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
    error(e){
        console.log(e);
        this.state = "ERROR";
        this.majModal();
    }

    /**
     * Enregistre l'objet game dans le local storage
     */
    store(){
        window.localStorage.setItem(this.game_id,Game.jsonEncode(this));
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
    static jsonEncode(game_decoded){
        const game_encoded = JSON.stringify(game_decoded);
        if (game_encoded !== ""){
            return game_encoded
        }else{
            return null;
        }
    }

    /**
     *
     * @param game_id
     * @returns {Game|null}
     */
    static load(game_id){
        const game = window.localStorage.getItem(game_id);
        if (window.localStorage.getItem(game_id) !== null){
            return Game.jsonDecode(game);
        }else{
            return null;
        }
    }

    static reload(game_id = null){
        let url = window.location.href;
        if (game_id !== null){
            if (window.location.search !== ""){
                url = window.location.origin+'?game_id='+game_id
            }else{
                if (url.indexOf('?') > -1){
                    url += '&game_id='+game_id;
                }else{
                    url += '?game_id='+game_id;
                }
            }
        }
        window.location.href = url;
        window.location.reload();
    }

}