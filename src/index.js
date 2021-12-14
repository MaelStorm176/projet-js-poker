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

const drawCrad = fetch("https://deckofcardsapi.com/api/deck/e3148dhynphx/draw/?count=2")
    .then((response) => response.json())
    .then((data) => {
        console.log(data);

        let div = document.createElement("div");
        document.body.appendChild(div);

        var myImage1 = new Image(150, 200);
        console.log(data.cards[0].image);
        myImage1.src = data.cards[0].image;
        div.append(myImage1);

        var myImage2 = new Image(150, 200);
        console.log(data.cards[1].image);
        myImage2.src = data.cards[1].image;
        div.append(myImage2);

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
                    var newImg = new Image(150, 200);
                    console.log(data.cards[0].image);
                    newImg.src = data.cards[0].image;
                    div.append(newImg);
                })
        }
        document.body.appendChild(btn2);
    });