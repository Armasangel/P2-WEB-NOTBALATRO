import { JOKER_POOL } from '../data/jokers';
import './GameOver.css';

/**
 * Pantalla de Game Over con resumen de la partida.
 * Props:
 *  - round: ronda en la que terminó
 *  - currentScore: puntaje alcanzado en la última ronda
 *  - targetScore: puntaje que había que alcanzar
 *  - ownedJokerIds: jokers acumulados durante la partida
 *  - onRestart: función para reiniciar
 *  - onMenu: función para volver al menú
 */
function GameOver({ round, currentScore, targetScore, ownedJokerIds, onRestart, onMenu }) {
  const ownedJokers = ownedJokerIds
    .map((id) => JOKER_POOL.find((j) => j.id === id))
    .filter(Boolean);

  return (
    <div className="gameover">
      <div className="gameover-content">
        <div className="gameover-skull">💀</div>
        <h2 className="gameover-title">GAME OVER</h2>
        <p className="gameover-subtitle">El mazo se agotó antes de tiempo.</p>

        <div className="gameover-stats">
          <div className="stat-row">
            <span className="stat-label">Ronda alcanzada</span>
            <span className="stat-value">{round}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Puntaje final</span>
            <span className="stat-value score">{currentScore}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Objetivo de la ronda</span>
            <span className="stat-value target">{targetScore}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Diferencia</span>
            <span className="stat-value diff">-{targetScore - currentScore} pts</span>
          </div>
        </div>

        {ownedJokers.length > 0 && (
          <div className="gameover-jokers">
            <p className="gameover-jokers-label">Jokers obtenidos:</p>
            <div className="gameover-jokers-list">
              {ownedJokers.map((joker) => (
                <div key={joker.id} className="gameover-joker-chip">
                  <span>{joker.emoji}</span>
                  <span>{joker.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="gameover-actions">
          <button className="btn-go btn-go-primary" onClick={onRestart}>
            🔄 Jugar de nuevo
          </button>
          <button className="btn-go btn-go-secondary" onClick={onMenu}>
            ← Menú principal
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameOver;