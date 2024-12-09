import { useState } from 'react';

export default function ScoreSubmission({ score, correctAnswers, onSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    if (name.trim() === '') return;
    await fetch('/api/submitScore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name,
        sessionId: document.cookie.match(/session-id=([^;]+)/)?.[1]
      }),
    });
    onSubmit();
  };

  return (
    <div className="text-center p-8">
      <h1 className="title-text text-4xl mb-8">Final Score: {score}</h1>
      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="Enter your name"
          className="input-field w-full mb-6"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="game-button w-full"
          onClick={handleSubmit}
        >
          Submit Score
        </button>
      </div>
    </div>
  );
}