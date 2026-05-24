//Detecta la mejor combinación de póker en las cartas seleccionadas
// devuelve { handName, baseScore, multiplier }.

// Tabla de combinaciones: nombre, puntaje base, multiplicador
const HAND_RANKINGS = {
  ROYAL_FLUSH:    { name: 'Royal Flush',    baseScore: 800, multiplier: 8 },
  STRAIGHT_FLUSH: { name: 'Straight Flush', baseScore: 500, multiplier: 7 },
  FOUR_OF_A_KIND: { name: 'Póker (4 iguales)', baseScore: 300, multiplier: 6 },
  FULL_HOUSE:     { name: 'Full House',     baseScore: 200, multiplier: 5 },
  FLUSH:          { name: 'Color (Flush)',  baseScore: 120, multiplier: 4 },
  STRAIGHT:       { name: 'Escalera',       baseScore: 100, multiplier: 4 },
  THREE_OF_A_KIND:{ name: 'Trío',           baseScore: 60,  multiplier: 3 },
  TWO_PAIR:       { name: 'Doble Par',      baseScore: 40,  multiplier: 2 },
  PAIR:           { name: 'Par',            baseScore: 20,  multiplier: 2 },
  HIGH_CARD:      { name: 'Carta Alta',     baseScore: 5,   multiplier: 1 },
};

// Agrupa cartas por rank. Devuelve un objeto { rank: [cartas] }.
function groupByRank(cards) {
  return cards.reduce((groups, card) => {
    if (!groups[card.rank]) groups[card.rank] = [];
    groups[card.rank].push(card);
    return groups;
  }, {});
}

// Verifica si todas las cartas son del mismo palo.
function isFlush(cards) {
  return cards.every((c) => c.suit === cards[0].suit);
}

// Verifica si las cartas forman una escalera (valores consecutivos).
function isStraight(cards) {
  const values = cards.map((c) => c.value).sort((a, b) => a - b);

  // Escalera normal
  const isNormal = values.every((v, i) => i === 0 || v === values[i - 1] + 1);
  if (isNormal) return true;

  // Escalera baja: A-2-3-4-5 (el As vale 1)
  const lowAce = values.map((v) => (v === 14 ? 1 : v)).sort((a, b) => a - b);
  return lowAce.every((v, i) => i === 0 || v === lowAce[i - 1] + 1);
}

// Verifica si es Royal Flush (A-K-Q-J-10 del mismo palo).s
function isRoyalFlush(cards) {
  if (!isFlush(cards)) return false;
  const values = cards.map((c) => c.value).sort((a, b) => a - b);
  return JSON.stringify(values) === JSON.stringify([10, 11, 12, 13, 14]);
}

/**
 * Evalúa las cartas seleccionadas y devuelve la combinación detectada.
 * @param {Array} selectedCards - entre 1 y 5 cartas seleccionadas
 * @returns {{ handName, baseScore, multiplier, totalScore }}
 */
export function evaluateHand(selectedCards) {
  if (!selectedCards || selectedCards.length === 0) {
    return { handName: 'Sin selección', baseScore: 0, multiplier: 1, totalScore: 0 };
  }

  // Solo evaluamos combinaciones estándar con exactamente 5 cartas
  // Con menos cartas, evaluamos lo que se pueda
  const cards = selectedCards;
  const groups = groupByRank(cards);
  const counts = Object.values(groups).map((g) => g.length).sort((a, b) => b - a);

  let result;

  if (cards.length === 5) {
    if (isRoyalFlush(cards)) {
      result = HAND_RANKINGS.ROYAL_FLUSH;
    } else if (isFlush(cards) && isStraight(cards)) {
      result = HAND_RANKINGS.STRAIGHT_FLUSH;
    } else if (counts[0] === 4) {
      result = HAND_RANKINGS.FOUR_OF_A_KIND;
    } else if (counts[0] === 3 && counts[1] === 2) {
      result = HAND_RANKINGS.FULL_HOUSE;
    } else if (isFlush(cards)) {
      result = HAND_RANKINGS.FLUSH;
    } else if (isStraight(cards)) {
      result = HAND_RANKINGS.STRAIGHT;
    } else if (counts[0] === 3) {
      result = HAND_RANKINGS.THREE_OF_A_KIND;
    } else if (counts[0] === 2 && counts[1] === 2) {
      result = HAND_RANKINGS.TWO_PAIR;
    } else if (counts[0] === 2) {
      result = HAND_RANKINGS.PAIR;
    } else {
      result = HAND_RANKINGS.HIGH_CARD;
    }
  } else {
    // Menos de 5 cartas: evaluar pares/tríos/etc parciales
    if (counts[0] === 4) result = HAND_RANKINGS.FOUR_OF_A_KIND;
    else if (counts[0] === 3) result = HAND_RANKINGS.THREE_OF_A_KIND;
    else if (counts[0] === 2 && counts[1] === 2) result = HAND_RANKINGS.TWO_PAIR;
    else if (counts[0] === 2) result = HAND_RANKINGS.PAIR;
    else result = HAND_RANKINGS.HIGH_CARD;
  }

  // Suma de valores de las cartas como bonus al puntaje base
  const cardValueBonus = cards.reduce((sum, c) => sum + Math.min(c.value, 10), 0);
  const totalScore = (result.baseScore + cardValueBonus) * result.multiplier;

  return {
    handName: result.name,
    baseScore: result.baseScore + cardValueBonus,
    multiplier: result.multiplier,
    totalScore,
  };
}

// Genera el puntaje objetivo para la ronda X.

export function getTargetScore(round) {
  const base = 80;
  return Math.floor(base * Math.pow(1.6, round - 1));
}