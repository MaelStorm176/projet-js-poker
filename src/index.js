//import shuffleDeck from "./librairies/shuffle.js";

const url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6"


/*async function fetchDeckJSON() {
    const response = await fetch(url);
    const deck = await response.json();
    return deck;
}
fetchDeckJSON().then(deck => {
    const idDeck = deck; // fetched movies
    console.log(idDeck);
});*/

const url_shuffle = "https://deckofcardsapi.com/api/deck/e3148dhynphx/return/"

async function shuffleDeck() {
    const response = await fetch(url_shuffle);
    const shuffle = await response.json();
    console.log(shuffle);
    //await window.location.reload();
    return shuffle;
}

let value = {
    "A": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "0": 10,
    "J": 10,
    "Q": 10,
    "K": 10
}

const drawCrad = fetch("https://deckofcardsapi.com/api/deck/e3148dhynphx/draw/?count=2")
    .then((response) => response.json())
    .then((data) => {
        console.log(data);

        let score_finale = 0;

        let div = document.createElement("div");
        div.style.display = "flex";
        document.body.appendChild(div);

        let div_score1 = document.createElement("div");
        div.append(div_score1);
        let div_score2 = document.createElement("div");
        div.append(div_score2);

        var myImage1 = new Image(150, 200);
        myImage1.src = data.cards[0].image;
        div_score1.append(myImage1);
        let score1 = data.cards[0].code.charAt(0);
        let textScore1 = document.createElement("p")
        textScore1.textContent += "Valeur 1 : " + value[score1];
        div_score1.append(textScore1);
        score_finale += value[score1];

        var myImage2 = new Image(150, 200);
        myImage2.src = data.cards[1].image;
        div_score2.append(myImage2);
        let score2 = data.cards[1].code.charAt(0);
        let textScore2 = document.createElement("p")
        textScore2.textContent += "Valeur 2 : " + value[score2];
        div_score2.append(textScore2);
        score_finale += value[score2];

        let textScoreFinale = document.createElement("p")
        textScoreFinale.id = "score_finale";
        textScoreFinale.textContent += "Score : " + score_finale;
        document.body.append(textScoreFinale);

        let btn = document.createElement("button");
        btn.innerHTML = "Relancer";
        btn.type = "submit";
        btn.onclick = function() {
            shuffleDeck();
        }
        document.body.appendChild(btn);

        let btn2 = document.createElement("button");
        btn2.innerHTML = "Piocher une nouvelle carte";
        btn2.onclick = function() {
            fetch("https://deckofcardsapi.com/api/deck/e3148dhynphx/draw/?count=1")
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);

                    let div_scoreX = document.createElement("div");
                    div.append(div_scoreX);

                    var newImg = new Image(150, 200);
                    console.log(data.cards[0].image);
                    newImg.src = data.cards[0].image;
                    div_scoreX.append(newImg);
                    let scoreX = data.cards[0].code.charAt(0);
                    let textScoreX = document.createElement("p")
                    textScoreX.textContent += "Valeur de la carte : " + value[scoreX];
                    div_scoreX.append(textScoreX);
                    score_finale += value[scoreX];
                    document.getElementById('score_finale').innerText = "Score : " + score_finale;
                })
        }
        document.body.appendChild(btn2);

        if (score_finale > 21) {
            console.log(score_finale);
            let loose = document.createElement("h1");
            loose.innerText = "You loose";
            div.append(loose);
        }
    });