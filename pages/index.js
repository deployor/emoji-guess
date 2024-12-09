import { useState } from 'react';
import Game from '../components/Game';
import ScoreSubmission from '../components/ScoreSubmission';
import Leaderboard from '../components/Leaderboard';
import Snowfall from '../components/Snowfall';

export default function Home() {
  const [view, setView] = useState('game'); // 'game', 'submit', 'leaderboard'
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-game-gradient-from to-game-gradient-to">
      <Snowfall />
      {view === 'game' && (
        <Game
          onGameEnd={(finalScore, answers) => {
            setScore(finalScore);
            setCorrectAnswers(answers);
            setView('submit');
          }}
        />
      )}
      {view === 'submit' && (
        <ScoreSubmission
          score={score}
          correctAnswers={correctAnswers}
          onSubmit={() => setView('leaderboard')}
        />
      )}
      {view === 'leaderboard' && (
        <Leaderboard
          onRestart={() => {
            setScore(0);
            setView('game');
          }}
        />
      )}
    </div>
  );
}
