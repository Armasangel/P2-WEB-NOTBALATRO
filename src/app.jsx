import { useState, useCallback } from 'react';
import Hand from './components/Hand';
import ScoreBoard from './components/ScoreBoard';
import JokerSelector from './components/JokerSelector';
import ActiveJokers from './components/ActiveJokers';
import MainMenu from './components/MainMenu';
import GameOver from './components/GameOver';
import { createDeck } from './data/deck';
import { shuffleDeck, dealCards, replaceSelectedCards } from './utils/deckUtils';
import { evaluateHand, getTargetScore } from './utils/scoreUtils';
import { getJokerOptions, applyJokers } from './data/jokers';
import './App.css';

const HAND_SIZE = 8;
const MAX_SELECTED = 5;

const PHASE = {
  MENU:         'menu',
  PLAYING:      'playing',
  JOKER_SELECT: 'joker_select',
  GAME_OVER:    'game_over',
};

function buildFreshGame() {
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
    phase: PHASE.PLAYING,
    ownedJokerIds: [],
    jokerOptions: [],
  };
}

function App() {
  const [state, setState] = useState({ phase: PHASE.MENU });

  // ── Iniciar / reiniciar partida ──
  const handleStart = useCallback(() => {
    setState(buildFreshGame());
  }, []);

  const handleRestart = useCallback(() => {
    setState(buildFreshGame());
  }, []);

  const handleGoMenu = useCallback(() => {
    setState({ phase: PHASE.MENU });
  }, []);

  // ── Toggle selección de carta ──
  const handleCardClick = useCallback((cardId) => {
    setState((prev) => {
      if (prev.phase !== PHASE.PLAYING) return prev;
      const already = prev.selectedIds.includes(cardId);
      if (!already && prev.selectedIds.length >= MAX_SELECTED) return prev;
      const selectedIds = already
        ? prev.selectedIds.filter((id) => id !== cardId)
        : [...prev.selectedIds, cardId];
      return { ...prev, selectedIds };
    });
  }, []);

  // ── Jugar mano ──
  const handlePlayHand = useCallback(() => {
    setState((prev) => {
      if (prev.selectedIds.length === 0 || prev.phase !== PHASE.PLAYING) return prev;

      const selectedCards = prev.hand.filter((c) => prev.selectedIds.includes(c.id));
      const result = evaluateHand(selectedCards);
      const scoreAfterJokers = applyJokers(
        result.totalScore,
        selectedCards,
        result.handName,
        prev.ownedJokerIds
      );

      const newScore = prev.currentScore + scoreAfterJokers;
      const roundWon = newScore >= prev.targetScore;

      const { newHand, newRemainingDeck } = replaceSelectedCards(
        prev.hand,
        prev.selectedIds,
        prev.deck
      );

      const isGameOver = !roundWon && newRemainingDeck.length === 0;

      let nextPhase = PHASE.PLAYING;
      if (isGameOver) nextPhase = PHASE.GAME_OVER;
      else if (roundWon) nextPhase = PHASE.JOKER_SELECT;

      const jokerOptions = roundWon ? getJokerOptions(prev.ownedJokerIds) : [];

      return {
        ...prev,
        deck: newRemainingDeck,
        hand: newHand,
        selectedIds: [],
        currentScore: newScore,
        lastHandResult: {
          handName: result.handName,
          totalScore: scoreAfterJokers,
          wasJokered: scoreAfterJokers !== result.totalScore,
        },
        phase: nextPhase,
        jokerOptions,
      };
    });
  }, []);

  // ── Elegir joker y avanzar ronda ──
  const handleJokerSelect = useCallback((jokerId) => {
    setState((prev) => {
      const nextRound = prev.round + 1;
      const ownedJokerIds = [...prev.ownedJokerIds, jokerId];

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
        phase: PHASE.PLAYING,
        ownedJokerIds,
        jokerOptions: [],
      };
    });
  }, []);

  const { phase } = state;

  // ── MENÚ ──
  if (phase === PHASE.MENU) {
    return <MainMenu onStart={handleStart} />;
  }

  const {
    hand, selectedIds, round, currentScore, targetScore,
    lastHandResult, ownedJokerIds, jokerOptions, deck,
  } = state;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">NOT BALATRO</h1>
        <div className="app-header-right">
          <span className="app-subtitle">Ronda {round}</span>
          <button className="btn-restart" onClick={handleRestart} title="Reiniciar partida">
            🔄
          </button>
        </div>
      </header>

      <main className="app-main">

        {/* ── GAME OVER ── */}
        {phase === PHASE.GAME_OVER && (
          <GameOver
            round={round}
            currentScore={currentScore}
            targetScore={targetScore}
            ownedJokerIds={ownedJokerIds}
            onRestart={handleRestart}
            onMenu={handleGoMenu}
          />
        )}

        {/* ── SELECCIÓN DE JOKER ── */}
        {phase === PHASE.JOKER_SELECT && (
          <JokerSelector
            options={jokerOptions}
            onSelect={handleJokerSelect}
          />
        )}

        {/* ── JUGANDO ── */}
        {phase === PHASE.PLAYING && (
          <>
            <ScoreBoard
              round={round}
              targetScore={targetScore}
              currentScore={currentScore}
              deckCount={deck.length}
              handResult={lastHandResult}
            />

            <ActiveJokers jokerIds={ownedJokerIds} />

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