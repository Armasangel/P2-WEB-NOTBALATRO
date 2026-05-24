import React from 'react';
import './JokerSelector.css';

//Pantalla que aparece al terminar una ronda.
// Muestra 2 opciones de joker para que el jugador elija uno.

function JokerSelector({ options = [], onSelect }) {
  return (
    <div className="joker-selector">
      <h2 className="joker-title">¡Elige un Joker!</h2>
      <p className="joker-subtitle">El joker elegido se aplicará en todas tus jugadas futuras.</p>

      <div className="joker-options">
        {options.map((joker) => (
          <button
            key={joker.id}
            className="joker-card"
            onClick={() => onSelect(joker.id)}
          >
            <span className="joker-emoji">{joker.emoji}</span>
            <span className="joker-name">{joker.name}</span>
            <span className="joker-desc">{joker.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default JokerSelector;