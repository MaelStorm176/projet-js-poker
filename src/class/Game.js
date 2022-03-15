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
     * @param deck_id
     */
    constructor(state, score, dev, span_score, carte_rest, score_croupier, scoreC, deck_id = null) {
        super(span_score, carte_rest, score_croupier, deck_id);
        this.state = state;
        this.score = score;
        this.dev = dev; //Debugging en mode dev
        this.scoreC = scoreC;
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
                    this.majModal();
                    window.localStorage.setItem('ScoreCroupier', `${this.scoreC}`);
                    window.localStorage.setItem('ScoreJoueur', `${this.score}`);
                    window.localStorage.setItem('Etat', `${this.state}`);
                    window.navigator.vibrate([1000, 1000, 2000]);
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
    majModal(){
        let modal = document.getElementById("myModal");
        document.getElementById("result").textContent += this.state;
        document.getElementById("scoreJ").textContent += this.score;
        document.getElementById("scoreCr").textContent += this.scoreC;
        
        modal.style.display = "block";
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

    store(){

    }
}