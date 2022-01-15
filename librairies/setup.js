export function setup() {
    const newImg2 = document.createElementNS('http://www.w3.org/2000/svg', 'image');

    newImg2.setAttributeNS(null, 'x', '83');
    newImg2.setAttributeNS(null, 'y', '122.74');
    newImg2.setAttributeNS(null, 'width', '110');
    newImg2.setAttributeNS(null, 'height', '75');
    newImg2.setAttributeNS(null, 'href', 'http://localhost:8080/img/deck.png');
    newImg2.id = "deck";
    document.getElementById('paquet').parentNode.insertBefore(newImg2, document.getElementById('paquet'));
}

export function setupDrawCardJoueur(urlCard, x, y) {
    var tailleX = x + 10;
    const newImg2 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    newImg2.setAttributeNS(null, 'x', tailleX);
    newImg2.setAttributeNS(null, 'y', y);
    newImg2.setAttributeNS(null, 'width', '110');
    newImg2.setAttributeNS(null, 'height', '75');
    newImg2.setAttributeNS(null, 'href', urlCard);

    return newImg2;
}