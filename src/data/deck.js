// Definición de la baraja completa de 52 cartas

export const SUITS = [
  { name: 'spades',   symbol: '♠', color: 'black' },
  { name: 'hearts',   symbol: '♥', color: 'red'   },
  { name: 'diamonds', symbol: '♦', color: 'red'   },
  { name: 'clubs',    symbol: '♣', color: 'black' },
];

export const RANKS = [
  { name: 'A', value: 14, display: 'A' },
  { name: '2', value: 2,  display: '2' },
  { name: '3', value: 3,  display: '3' },
  { name: '4', value: 4,  display: '4' },
  { name: '5', value: 5,  display: '5' },
  { name: '6', value: 6,  display: '6' },
  { name: '7', value: 7,  display: '7' },
  { name: '8', value: 8,  display: '8' },
  { name: '9', value: 9,  display: '9' },
  { name: '10', value: 10, display: '10' },
  { name: 'J', value: 11, display: 'J' },
  { name: 'Q', value: 12, display: 'Q' },
  { name: 'K', value: 13, display: 'K' },
];

// Genera la baraja completa de 52 cartas.
export function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${rank.name}_${suit.name}`,
        suit: suit.name,
        suitSymbol: suit.symbol,
        color: suit.color,
        rank: rank.name,
        value: rank.value,
        display: rank.display,
      });
    }
  }
  return deck;
}