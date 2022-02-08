import { CardApi } from './CardApi.js'
import { sleep } from '../../librairies/setup.js'

export class Game extends CardApi {
    constructor(state, score, dev, span_score, carte_rest, score_croupier, scoreC) {
        super(span_score, carte_rest, score_croupier);
        this.state = state;
        this.score = score;
        this.dev = dev; //Debugging en mode dev
        this.scoreC = scoreC;
    }

    //Si un joueur dépasse 21
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
    isFinish2() {
        if (this.state == "started") {
            this.drawNewCardCroup('carte1_croup', '322', '122')
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

    drawNewCardCroup(id, x, y) {
        this.getNewCard().then((card) => {
            this.createDivCardCroup(card, id, x, y);

            /**** CARTES RESTANTES ****/
            this.scoreC += this.value[card.code.charAt(0)];
            this.score_croupier.textContent = "Score : " + this.scoreC;

            /**** RETEST SI ON A GAGNE/PERDU ****/
            if (this.scoreC > 10) {
                if (this.isFinish2() && this.state != "end") {
                    alert(`Le jeu est fini : ${this.state}`);
                    window.navigator.vibrate([1000, 1000, 2000]);
                    this.state = "end";
                }
                console.log(sleep(10));
                return true;
            }
        });
    }
}