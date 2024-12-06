import { useState, useEffect } from 'react';

export default function Leaderboard({ onRestart }) {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    fetch('/api/getHighScores')
      .then((res) => res.json())
      .then((data) => setHighScores(data));
  }, []);

  return (
    <div className="text-center p-8">
      <h1 className="title-text text-4xl mb-8">Leaderboard</h1>
      <div className="max-w-md mx-auto bg-gray-800/30 rounded-xl p-6 shadow-lg mb-8">
        {highScores.map((score, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center mb-4 p-3 rounded-lg bg-gray-800/50"
          >
            <div className="flex items-center">
              <span className="text-gray-400 font-game text-xl mr-4">#{index + 1}</span>
              <span className="text-white font-game">{score.name}</span>
            </div>
            <span className="text-neon-purple font-game">{score.score}</span>
          </div>
        ))}
      </div>
      <button
        className="game-button px-8"
        onClick={onRestart}
      >
        Play Again
      </button>
    </div>
  );
}