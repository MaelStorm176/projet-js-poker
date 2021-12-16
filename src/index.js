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

const url_shuffle = "https://deckofcardsapi.com/api/deck/ref9gg88uwjm/return/"

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

function drawNewCard() {
    fetch("https://deckofcardsapi.com/api/deck/ref9gg88uwjm/draw/?count=1")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            let div = document.getElementById('add_card');
            let div_scoreX = document.createElement("div");
            div.append(div_scoreX);

            let newScore = document.getElementById('score').innerHTML;
            newScore = Number(newScore.slice(-2));
            let textScoreV = document.getElementById("newValue");

            var newImg = new Image(150, 200);
            newImg.src = data.cards[0].image;
            newImg.style.marginLeft = "-100%";
            newImg.style.transform = "rotate(-10deg)";
            div_scoreX.append(newImg);

            let scoreX = data.cards[0].code.charAt(0);
            let textScoreX = document.createElement("p")
            textScoreV.innerText += "\n\nValeur de la nouvelle carte : " + data.cards[0].code + " - " + value[scoreX];
            div_scoreX.append(textScoreX);
            newScore += value[scoreX];

            document.getElementById('score').innerText = "Score : " + newScore;

            document.getElementById('carte_rest').innerText = "Nombre de cartes restantes : " + data.remaining

            if (newScore > 21) {
                let loose = document.getElementById('score').innerText = "You loose, sale merde, cliquer sur le deck pour relancer un jeu";

                if (document.getElementById('deck').click) {
                    window.location.reload();
                }
            }
        })
}

const drawCrad = fetch("https://deckofcardsapi.com/api/deck/ref9gg88uwjm/draw/?count=2")
    .then((response) => response.json())
    .then((data) => {
        console.log(data);

        let score_finale = 0;

        let div = document.createElement("div");
        div.style.display = "flex";
        div.style.margin = "5%";
        div.id = "principale";
        document.body.appendChild(div);

        let div_score1 = document.getElementById('carte1');
        let div_score2 = document.getElementById('carte2');

        var myImage1 = new Image(150, 200);
        myImage1.src = data.cards[0].image;
        myImage1.style.transform = "rotate(-10deg)";
        div_score1.append(myImage1);
        let score1 = data.cards[0].code.charAt(0);
        document.getElementById('value1').innerText = "Valeur carte 1 : " + data.cards[0].code + " - " + value[score1]
        score_finale += value[score1];

        var myImage2 = new Image(150, 200);
        myImage2.src = data.cards[1].image;
        myImage2.style.marginLeft = "-60%";
        myImage2.style.transform = "rotate(25deg)";
        div_score2.append(myImage2);
        let score2 = data.cards[1].code.charAt(0);
        document.getElementById('value2').innerText = "Valeur carte 2 : " + data.cards[1].code + " - " + value[score2]
        score_finale += value[score2];

        document.getElementById('score').innerText = "Votre score est de : " + score_finale;

        document.getElementById('carte_rest').innerText = "Nombre de cart restantes : " + data.remaining;
    });