import React from 'react';
import './ScoreBoard.css';

//Muestra información de la ronda actual.

function ScoreBoard({ round, targetScore, currentScore, deckCount, handResult }) {
  const progress = Math.min((currentScore / targetScore) * 100, 100);

  return (
    <div className="scoreboard">
      <div className="scoreboard-info">
        <div className="info-block">
          <span className="info-label">Ronda</span>
          <span className="info-value">{round}</span>
        </div>
        <div className="info-block">
          <span className="info-label">Objetivo</span>
          <span className="info-value target">{targetScore}</span>
        </div>
        <div className="info-block">
          <span className="info-label">Puntaje</span>
          <span className="info-value score">{currentScore}</span>
        </div>
        <div className="info-block">
          <span className="info-label">Cartas en mazo</span>
          <span className="info-value">{deckCount}</span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
        <span className="progress-label">{Math.floor(progress)}%</span>
      </div>

      {/* Resultado de la última jugada */}
      {handResult && (
        <div className="hand-result">
          <span className="hand-name">{handResult.handName}</span>
          <span className="hand-score">+{handResult.totalScore} pts</span>
        </div>
      )}
    </div>
  );
}

export default ScoreBoard;