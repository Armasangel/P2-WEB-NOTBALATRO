import React from 'react';
import Card from './Card';
import './Hand.css';

// Renderiza la mano completa del jugador.
function Hand({ cards = [], selectedIds = [], onCardClick }) {
  return (
    <div className="hand">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          selected={selectedIds.includes(card.id)}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}

export default Hand;