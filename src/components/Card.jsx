import React from 'react';
import './Card.css';

// Componente de una carta individual.
function Card({ card, selected = false, onClick }) {
  const handleClick = () => {
    if (onClick) onClick(card.id);
  };

  return (
    <div
      className={`card ${card.color} ${selected ? 'selected' : ''}`}
      onClick={handleClick}
      role="button"
      aria-pressed={selected}
      title={`${card.display} de ${card.suitSymbol}`}
    >
      {/* Esquina superior izquierda */}
      <div className="card-corner top-left">
        <span className="card-rank">{card.display}</span>
        <span className="card-suit">{card.suitSymbol}</span>
      </div>

      {/* Centro */}
      <div className="card-center">
        <span className="card-suit-large">{card.suitSymbol}</span>
      </div>

      {/* Esquina inferior derecha (rotada) */}
      <div className="card-corner bottom-right">
        <span className="card-rank">{card.display}</span>
        <span className="card-suit">{card.suitSymbol}</span>
      </div>
    </div>
  );
}

export default Card;