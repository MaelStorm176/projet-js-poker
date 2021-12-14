const url_shuffle = "https://deckofcardsapi.com/api/deck/e3148dhynphx/return/"

async function shuffleDeck() {
    const response = await fetch(url_shuffle);
    const shuffle = await response.json();
    console.log(shuffle);
    return shuffle;
}