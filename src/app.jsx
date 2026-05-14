import { useState, useCallback } from 'react';
import Hand from './components/Hand';
import ScoreBoard from './components/ScoreBoard';
import { createDeck } from './data/deck';
import { shuffleDeck, dealCards, replaceSelectedCards } from './utils/deckUtils';
import { evaluateHand, getTargetScore } from './utils/scoreUtils';
import './App.css';

const HAND_SIZE = 8;
const MAX_SELECTED = 5;

function initGame() {
  const shuffled = shuffleDeck(createDeck());
  const { hand, remainingDeck } = dealCards(shuffled, HAND_SIZE);
  return {
    deck: remainingDeck,
    hand,
    selectedIds: [],
    round: 1,
    currentScore: 0,
    targetScore: getTargetScore(1),
    lastHandResult: null,
    gameOver: false,
    roundWon: false,
  };
}

function App() {
  const [state, setState] = useState(initGame);

  // Toggle selección de carta (máximo MAX_SELECTED)
  const handleCardClick = useCallback((cardId) => {
    setState((prev) => {
      if (prev.gameOver || prev.roundWon) return prev;

      const already = prev.selectedIds.includes(cardId);
      if (!already && prev.selectedIds.length >= MAX_SELECTED) return prev;

      const selectedIds = already
        ? prev.selectedIds.filter((id) => id !== cardId)
        : [...prev.selectedIds, cardId];

      return { ...prev, selectedIds };
    });
  }, []);

  // Jugar la mano seleccionada
  const handlePlayHand = useCallback(() => {
    setState((prev) => {
      if (prev.selectedIds.length === 0 || prev.gameOver) return prev;

      const selectedCards = prev.hand.filter((c) => prev.selectedIds.includes(c.id));
      const result = evaluateHand(selectedCards);
      const newScore = prev.currentScore + result.totalScore;
      const roundWon = newScore >= prev.targetScore;

      // Reemplazar cartas jugadas por nuevas del mazo
      const { newHand, newRemainingDeck } = replaceSelectedCards(
        prev.hand,
        prev.selectedIds,
        prev.deck
      );

      // Si se acaba el mazo sin llegar al objetivo → game over
      const gameOver = !roundWon && newRemainingDeck.length === 0 && newHand.filter(
        (c) => prev.selectedIds.includes(c.id)
      ).length > 0;
      // Nota: replaceSelectedCards ya actualizó newHand, así que evaluamos si quedaron cartas

      const deckEmpty = newRemainingDeck.length < prev.selectedIds.length;
      const trueGameOver = !roundWon && deckEmpty && newRemainingDeck.length === 0;

      return {
        ...prev,
        deck: newRemainingDeck,
        hand: newHand,
        selectedIds: [],
        currentScore: newScore,
        lastHandResult: { handName: result.handName, totalScore: result.totalScore },
        roundWon,
        gameOver: trueGameOver,
      };
    });
  }, []);

  // Avanzar a la siguiente ronda
  const handleNextRound = useCallback(() => {
    setState((prev) => {
      const nextRound = prev.round + 1;
      // Nuevo mazo si no quedan suficientes cartas
      let deck = prev.deck;
      if (deck.length < HAND_SIZE) {
        deck = shuffleDeck(createDeck());
      }
      const { hand, remainingDeck } = dealCards(deck, HAND_SIZE);
      return {
        deck: remainingDeck,
        hand,
        selectedIds: [],
        round: nextRound,
        currentScore: 0,
        targetScore: getTargetScore(nextRound),
        lastHandResult: null,
        gameOver: false,
        roundWon: false,
      };
    });
  }, []);

  // Reiniciar partida
  const handleRestart = useCallback(() => {
    setState(initGame());
  }, []);

  const { hand, selectedIds, round, currentScore, targetScore, lastHandResult, gameOver, roundWon, deck } = state;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">NOT BALATRO</h1>
        <p className="app-subtitle">Ronda {round}</p>
      </header>

      <main className="app-main">
        <ScoreBoard
          round={round}
          targetScore={targetScore}
          currentScore={currentScore}
          deckCount={deck.length}
          handResult={lastHandResult}
        />

        {gameOver && (
          <div className="overlay game-over">
            <h2>💀 GAME OVER</h2>
            <p>No lograste llegar a <strong>{targetScore}</strong> puntos.</p>
            <button className="btn btn-primary" onClick={handleRestart}>
              Jugar de nuevo
            </button>
          </div>
        )}

        {roundWon && (
          <div className="overlay round-won">
            <h2>🎉 ¡Ronda Completada!</h2>
            <p>Lograste <strong>{currentScore}</strong> de <strong>{targetScore}</strong> pts.</p>
            <button className="btn btn-primary" onClick={handleNextRound}>
              Siguiente Ronda →
            </button>
          </div>
        )}

        {!gameOver && !roundWon && (
          <>
            <Hand
              cards={hand}
              selectedIds={selectedIds}
              onCardClick={handleCardClick}
            />

            <div className="action-bar">
              <p className="selection-hint">
                {selectedIds.length === 0
                  ? 'Selecciona hasta 5 cartas para jugar'
                  : `${selectedIds.length} carta${selectedIds.length > 1 ? 's' : ''} seleccionada${selectedIds.length > 1 ? 's' : ''}`}
              </p>
              <button
                className="btn btn-primary"
                onClick={handlePlayHand}
                disabled={selectedIds.length === 0}
              >
                ▶ Jugar mano
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;