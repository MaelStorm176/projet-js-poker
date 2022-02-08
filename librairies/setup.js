export function setup() {
    const newImg2 = document.createElementNS('http://www.w3.org/2000/svg', 'image');

    newImg2.setAttributeNS(null, 'x', '83');
    newImg2.setAttributeNS(null, 'y', '122.74');
    newImg2.setAttributeNS(null, 'width', '110');
    newImg2.setAttributeNS(null, 'height', '75');
    newImg2.setAttributeNS(null, 'href', '/img/deck.png');
    newImg2.id = "deck";
    document.getElementById('paquet').parentNode.insertBefore(newImg2, document.getElementById('paquet'));

    const newImg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    newImg.setAttributeNS(null, 'x', '312.5');
    newImg.setAttributeNS(null, 'y', '122.74');
    newImg.setAttributeNS(null, 'width', '110');
    newImg.setAttributeNS(null, 'height', '75');
    newImg.setAttributeNS(null, 'href', '/img/deck.png');
    newImg.id = "carteCache";
    newImg.style.zIndex = "0";
    newImg.animate(
        [
            // keyframes
            { transform: 'translateY(-300px)' },
            { transform: 'translateY(0px)' }
        ], {
            // timing options
            duration: 1000,
            iterations: 1
        }
    );
    document.getElementById('paquet').parentNode.insertBefore(newImg, document.getElementById('carte1_croupier'));
}

export function setupDrawCardJoueur(urlCard, x, y) {

    const newImg2 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    newImg2.setAttributeNS(null, 'x', x);
    newImg2.setAttributeNS(null, 'y', y);
    newImg2.setAttributeNS(null, 'width', '110');
    newImg2.setAttributeNS(null, 'height', '75');
    newImg2.setAttributeNS(null, 'href', urlCard);

    return newImg2;
}

export function DrawCardJoueur(urlCard, x, y) {
    let tailleX = x + 10;

    const newImg2 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    newImg2.setAttributeNS(null, 'x', tailleX);
    newImg2.setAttributeNS(null, 'y', y);
    newImg2.setAttributeNS(null, 'width', '110');
    newImg2.setAttributeNS(null, 'height', '75');
    newImg2.setAttributeNS(null, 'href', urlCard);

    return newImg2;
}

export function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}