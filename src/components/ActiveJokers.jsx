import React from 'react';
import { JOKER_POOL } from '../data/jokers';
import './ActiveJokers.css';

// Muestra los jokers activos del jugador en forma de chips pequeños.

function ActiveJokers({ jokerIds = [] }) {
  if (jokerIds.length === 0) return null;

  const jokers = jokerIds.map((id) => JOKER_POOL.find((j) => j.id === id)).filter(Boolean);

  return (
    <div className="active-jokers">
      <span className="active-jokers-label">Jokers activos:</span>
      <div className="active-jokers-list">
        {jokers.map((joker) => (
          <div key={joker.id} className="joker-chip" title={joker.description}>
            <span>{joker.emoji}</span>
            <span className="joker-chip-name">{joker.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActiveJokers;