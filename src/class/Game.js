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

        this.game_id = "game-"+Math.random();
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
                    var data = this.getScoreboard();
                    console.log(data);
                    if(data[0] != null){
                        console.log('ok');
                        var data1 = data[0].split(',');
                        var data2 = data[1].split(',');
                        var data3 = data[2].split(',');
                        console.log(data3.length);
                        if(data3.length > 5){
                            var stat = data3.shift();
                            data3.toString();
                        }else{
                            var data3 = data[2];
                        }
                        if(data2.length > 5){
                            var scoreJou = data2.shift();
                            data2.toString();
                        }else{
                            var data2 = data[1];
                        }
                        if(data1.length > 5){
                            var scoreCroupier = data1.shift();
                            data1.toString();
                        }else{
                            var data1 = data[0];
                        }
                    }else{
                        var data1 = data[0]
                        var data2 = data[1]
                        var data3 = data[2]
                    }
                    this.setScoreboard(data1, data2, data3);
                    this.store();
                    window.navigator.vibrate([1000, 1000, 2000]);
                    this.majModal(data1, data2, data3);
                    this.state = "end";
                }
            });
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
    majModal(data1, data2, data3) {
        let modal = document.getElementById("myModal");
        document.getElementById("result").textContent += this.state;
        document.getElementById("scoreJ").textContent += this.score;
        document.getElementById("scoreCr").textContent += this.scoreC;

        for(var i = 0; i<5; i++){
            var j = i+1;
            document.getElementById('score'+j).textContent += data1[i] + " - " + data3[i] + " - " + data2[i];
        }

        modal.style.display = "block";
    }


    setScoreboard(scoreCroup, scoreJoueur, statut) {
        if (scoreCroup != null && scoreJoueur != null && statut != null) {
            var scoreCroupier = { scoreCroup };
            var scoreJou = { scoreJoueur };
            var stat = { statut };
            //console.log(stat);
            //console.log(scoreJou);
            //console.log(scoreCroupier);
            stat = stat['statut'] + "," + this.state;
            scoreJou = scoreJou['scoreJoueur'] + "," + this.score;
            scoreCroupier = scoreCroupier['scoreCroup'] + "," + this.scoreC;
        } else {
            var scoreCroupier = this.scoreC;
            var scoreJou = this.score;
            var stat = this.state;
        }
        window.localStorage.setItem('ScoreCroupier', scoreCroupier);
        window.localStorage.setItem('ScoreJoueur', scoreJou);
        window.localStorage.setItem('StatutPartie', stat);
    }

    getScoreboard() {
        if (window.localStorage.getItem('ScoreCroupier') != "") {
            let scoreCroup = window.localStorage.getItem('ScoreCroupier');
            let scoreJoueur = window.localStorage.getItem('ScoreJoueur');
            let statut = window.localStorage.getItem('StatutPartie');

            return [scoreCroup, scoreJoueur, statut];
        }
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
        if (game_decoded instanceof Game){
            return game_decoded;
        }else{
            return null;
        }
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

}