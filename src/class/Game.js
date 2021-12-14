export class Game {
    constructor(state, score, cardsOnBoard, cardsRemaining) {
        this.state = state;
        this.score = score;
        this.cardsOnBoard = cardsOnBoard;
        this.cardsRemaining = cardsRemaining;
    }

    get cardsOnBoardNumber(){
        return this.cardsOnBoard.length;
    }

    get cardsRemainingNumber(){
        return this.cardsRemaining.length;
    }

    addCardOnBoard(card){
        const found = this.cardsRemaining.findIndex(cardRemaining => cardRemaining.code === card.code);
        this.cardsOnBoard.push(card);
        this.cardsRemaining.splice(found,1);
    }
}