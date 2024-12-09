import { useState, useEffect } from 'react';

export default function Leaderboard({ onRestart }) {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    fetch('/api/getHighScores')
      .then((res) => res.json())
      .then((data) => setHighScores(data));
  }, []);

  const getMedal = (index) => {
    const medals = ['🥇', '🥈', '🥉'];
    return index < 3 ? medals[index] : null;
  };

  return (
    <div className="text-center p-8">
      <h1 className="title-text text-4xl mb-8 animate-pulse">🏆 Leaderboard 🏆</h1>
      <div className="max-w-md mx-auto bg-gray-800/30 rounded-xl p-6 shadow-lg mb-8">
        {highScores.map((score, index) => (
          <div 
            key={index} 
            className={`flex justify-between items-center mb-4 p-3 rounded-lg bg-gray-800/50
              ${index < 3 ? 'animate-shine' : ''} 
              hover:scale-105 transition-transform`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-2">{getMedal(index) || '#' + (index + 1)}</span>
              <span className="text-white font-game">{score.name}</span>
            </div>
            <span className="text-neon-purple font-game text-xl">{score.score}</span>
          </div>
        ))}
      </div>
      <button
        className="game-button px-8 animate-bounce-slow"
        onClick={onRestart}
      >
        Play Again 🎮
      </button>
    </div>
  );
}