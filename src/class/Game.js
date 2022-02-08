import { CardApi } from './CardApi.js'
import { sleep } from '../../librairies/setup.js'

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
    }

    //Si un joueur dépasse 21
    /**
     * Test jeu fini joueur
     * @returns {boolean}
     */
    isFinish() {
        //Si on est en mode dev
        if (this.dev === true)
            return false;
        if (this.score > 21) {
            this.state = "loose";
            var modal = document.getElementById("myModal");
            document.getElementById("result").textContent += this.state;
            document.getElementById("scoreJ").textContent += this.score;
            document.getElementById("scoreCr").textContent += this.scoreC;
            modal.style.display = "block";
            return true;
        } else if (this.score === 21) {
            this.state = "win";
            var modal = document.getElementById("myModal");
            document.getElementById("result").textContent += this.state;
            document.getElementById("scoreJ").textContent += this.score;
            document.getElementById("scoreCr").textContent += this.scoreC;
            modal.style.display = "block";
            return true;
        } else if (this.score < 21 && this.state === "stopped") {
            this.state = "win";
            var modal = document.getElementById("myModal");
            document.getElementById("result").textContent += this.state;
            document.getElementById("scoreJ").textContent += this.score;
            document.getElementById("scoreCr").textContent += this.scoreC;
            modal.style.display = "block";
            return true;
        } else {
            this.state = "started";
            return false;
        }
    }

    //Si le croupier dépasse 21
    /**
     * Test jeu fini croupier
     * @returns {boolean}
     */
    isFinish2() {
        if (this.state === "started") {
            if (this.score < this.scoreC && this.scoreC < 21) {
                this.state = "loose";
                var modal = document.getElementById("myModal");
                document.getElementById("result").textContent += this.state;
                document.getElementById("scoreJ").textContent += this.score;
                document.getElementById("scoreCr").textContent += this.scoreC;
                modal.style.display = "block";
                return true;
            } else if (this.score === 21) {
                this.state = "win";
                var modal = document.getElementById("myModal");
                document.getElementById("result").textContent += this.state;
                document.getElementById("scoreJ").textContent += this.score;
                document.getElementById("scoreCr").textContent += this.scoreC;
                modal.style.display = "block";
                return true;
            } else if (this.score < this.scoreC && this.score < 21) {
                this.state = "win";
                var modal = document.getElementById("myModal");
                document.getElementById("result").textContent += this.state;
                document.getElementById("scoreJ").textContent += this.score;
                document.getElementById("scoreCr").textContent += this.scoreC;
                modal.style.display = "block";
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
     */
    drawNewCard(id, x, y) {
        this.getNewCard().then((card) => {
            this.createDivCard(card, id, x, y);
            this.state = 'joueur';
            /**** CARTES RESTANTES ****/
            this.score += this.value[card.code.charAt(0)];
            this.span_score.textContent = "Score : " + this.score;

            /**** RETEST SI ON A GAGNE/PERDU ****/
            if (this.isFinish()) {
                alert(`Le jeu est fini : ${this.state}`);
                window.navigator.vibrate([1000, 1000, 2000]);
            }
        });
    }

    /**
     * Tirer nouvelle carte croupier
     * @param id
     * @param x
     * @param y
     * @returns {Promise<void>}
     */
    async drawNewCardCroup(id, x, y) {
        await this.getNewCard().then((card) => {
            this.createDivCardCroup(card, id, x, y);

            /**** CARTES RESTANTES ****/
            this.scoreC += this.value[card.code.charAt(0)];
            this.score_croupier.textContent = "Score : " + this.scoreC;

            /**** TEST SI ON A GAGNE/PERDU ****/
            if (this.scoreC > 10) {
                if (this.isFinish2()) {
                    window.navigator.vibrate([1000, 1000, 2000]);
                    this.state = "end";
                    return;
                }
            }
        });
    }
}