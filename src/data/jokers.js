export const JOKER_POOL = [
  {
    id: 'multiplier',
    name: 'El Multiplicador',
    emoji: '🃏',
    description: 'Duplica el puntaje de cada jugada.',
    apply: (score, _cards) => score * 2,
  },
  {
    id: 'usurer',
    name: 'El Usurero',
    emoji: '💰',
    description: 'Suma 50 puntos fijos a cada jugada.',
    apply: (score, _cards) => score + 50,
  },
  {
    id: 'heart_lover',
    name: 'Amante de Corazones',
    emoji: '♥️',
    description: 'Si jugaste al menos un corazón, ×1.5 al puntaje.',
    apply: (score, cards) => {
      const hasHeart = cards.some((c) => c.suit === 'hearts');
      return hasHeart ? Math.floor(score * 1.5) : score;
    },
  },
  {
    id: 'chaos_king',
    name: 'Rey del Caos',
    emoji: '👑',
    description: 'Si tu jugada es solo carta alta (sin combinación), ×3 al puntaje.',
    apply: (score, _cards, handName) => {
      return handName === 'Carta Alta' ? score * 3 : score;
    },
  },
  {
    id: 'sniper',
    name: 'El Francotirador',
    emoji: '🎯',
    description: 'Suma el valor de tu carta más alta × 3.',
    apply: (score, cards) => {
      if (cards.length === 0) return score;
      const maxValue = Math.max(...cards.map((c) => Math.min(c.value, 10)));
      return score + maxValue * 3;
    },
  },
];

export function getJokerOptions(ownedJokerIds = []) {
  const available = JOKER_POOL.filter((j) => !ownedJokerIds.includes(j.id));
  const pool = available.length >= 2 ? available : JOKER_POOL;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

export function applyJokers(score, selectedCards, handName, ownedJokerIds) {
  let result = score;
  for (const jokerId of ownedJokerIds) {
    const joker = JOKER_POOL.find((j) => j.id === jokerId);
    if (joker) {
      result = joker.apply(result, selectedCards, handName);
    }
  }
  return Math.floor(result);
}