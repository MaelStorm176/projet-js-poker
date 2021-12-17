import {CardApi} from './CardApi.js'
export class Game extends CardApi{
    constructor(state, score, dev, span_score,add_card,carte_rest) {
        super(span_score,add_card,carte_rest);
        this.state = state;
        this.score = score;
        this.dev = dev; //Debugging en mode dev
    }

    isFinish(){
        //Si on est en mode dev
        if (this.dev === true)
            return false;

        if (this.score > 21) {
            this.state = "loose";
            return true;
        }else if(this.score === 21){
            this.state = "win";
            return true;
        }else if (this.score < 21 && this.state === "stopped"){
            this.state = "win";
            return true;
        }
        else{
            this.state = "started";
            return false;
        }
    }

    drawNewCard() {
         this.getNewCard().then((card)=>{
            this.createDivCard(card);

            /**** CARTES RESTANTES ****/
            this.score += this.value[card.code.charAt(0)];
            this.span_score.innerText = this.score;

            /**** RETEST SI ON A GAGNE/PERDU ****/
            if (this.isFinish()){
                alert(`Le jeu est fini : ${this.state}`);
                window.navigator.vibrate([1000, 1000, 2000]);
            }
        });
    }

    stopGame() {
        this.state = "stopped";
        this.drawNewCard();
    }

}