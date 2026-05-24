import React from 'react';
import './MainMenu.css';

/**
 * Pantalla de inicio del juego.
 * Props:
 *  - onStart: función que inicia la partida
 */
function MainMenu({ onStart }) {
  return (
    <div className="main-menu">
      <div className="menu-glow" />

      <div className="menu-content">
        <h1 className="menu-title">NOT BALATRO</h1>
        <p className="menu-tagline">Póker. Caos. Comodines.</p>

        <div className="menu-rules">
          <h3>¿Cómo se juega?</h3>
          <ul>
            <li>🃏 Recibes <strong>8 cartas</strong> por ronda.</li>
            <li>✋ Selecciona hasta <strong>5 cartas</strong> para formar una combinación de póker.</li>
            <li>🎯 Alcanza el <strong>puntaje objetivo</strong> antes de que se acabe el mazo.</li>
            <li>⭐ Al ganar una ronda, elige un <strong>Joker</strong> que potencia tus jugadas.</li>
            <li>💀 Si el mazo se acaba y no llegaste al objetivo: <strong>Game Over</strong>.</li>
          </ul>
        </div>

        <button className="menu-btn" onClick={onStart}>
          ▶ Jugar
        </button>
      </div>
    </div>
  );
}

export default MainMenu;