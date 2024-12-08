import { useState, useEffect } from 'react';

export default function Game({ onGameEnd }) {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(parseInt(process.env.NEXT_PUBLIC_TIMER_DURATION));
  const [selectedOption, setSelectedOption] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerHash, setAnswerHash] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState([]);

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onGameEnd(score, correctAnswers);
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchQuestion = async () => {
    const res = await fetch('/api/getQuestion');
    const data = await res.json();
    setQuestion(data.emoji);
    setOptions(data.options);
    setAnswerHash(data.answerHash);
    setSelectedOption('');
    setShowFeedback(false);
  };

  const handleAnswer = async (option) => {
    setSelectedOption(option);
    const res = await fetch('/api/submitAnswer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedOption: option, answerHash }),
    });
    const data = await res.json();
    if (data.correct) {
      setScore(s => s + 1);
      setCorrectAnswers(prev => [...prev, { answer: option }]);
    }
    setShowFeedback(true);
    setTimeout(fetchQuestion, 1000);
  };

  return (
    <div className="text-center p-8 max-w-4xl mx-auto christmas-card">
      <div className="text-gold text-4xl mb-4 font-display">
        ❄️🎄 Emoji Quiz for HC 🎄⛄
      </div>
      <h1 className="text-8xl mb-12 animate-bounce-slow">{question}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {options.map((option, index) => {
          let buttonClass = 'game-button';
          if (showFeedback) {
            if (option === answer) {
              buttonClass = 'game-button bg-holiday-green border-gold';
            } else if (option === selectedOption) {
              buttonClass = 'game-button bg-candy-red border-gold';
            }
          }
          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => handleAnswer(option)}
              disabled={showFeedback}
            >
              {option}
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex justify-around items-center">
        <div className="text-2xl font-game">
          <span className="text-gold">Score:</span>
          <span className="ml-2 text-candy-red">{score}</span>
        </div>
        <div className="text-2xl font-game">
          <span className="text-gold">Time:</span>
          <span className="ml-2 text-snow-white">{timeLeft}s</span>
        </div>
      </div>
    </div>
  );
}