//Baraja un array usando Fisher-Yates shuffle.
//Devuelve uno nuevo
export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Reparte `count` cartas del tope del mazo.
 * Devuelve { hand, remainingDeck }.
 */
export function dealCards(deck, count = 8) {
  const hand = deck.slice(0, count);
  const remainingDeck = deck.slice(count);
  return { hand, remainingDeck };
}

// Reemplaza las cartas seleccionadas por nuevas del mazo.
export function replaceSelectedCards(hand, selectedIds, remainingDeck) {
  const toReplace = selectedIds.length;

  // Si no hay suficientes cartas en el mazo, usamos las que queden
  const newCards = remainingDeck.slice(0, toReplace);
  const newRemainingDeck = remainingDeck.slice(toReplace);

  // Sustituimos las cartas seleccionadas manteniendo el orden
  let newCardIndex = 0;
  const newHand = hand.map((card) => {
    if (selectedIds.includes(card.id) && newCardIndex < newCards.length) {
      return newCards[newCardIndex++];
    }
    return card;
  });

  return { newHand, newRemainingDeck };
}

/**
 * Cuenta cuántas cartas quedan en el mazo.
 */
export function deckCount(deck) {
  return deck.length;
}