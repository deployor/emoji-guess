import { useState, useEffect } from 'react';
import PowerUps from './PowerUps';

export default function Game({ onGameEnd }) {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [serverScore, setServerScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(parseInt(process.env.NEXT_PUBLIC_TIMER_DURATION));
  const [selectedOption, setSelectedOption] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerHash, setAnswerHash] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [questionTimestamp, setQuestionTimestamp] = useState(null);
  const [showPowerUpAlert, setShowPowerUpAlert] = useState(false);
  const [powerUpMessage, setPowerUpMessage] = useState('');

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onGameEnd(serverScore, correctAnswers);
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
    setQuestionTimestamp(data.timestamp);
    setSelectedOption('');
    setShowFeedback(false);
  };

  const handlePowerUp = async (type) => {
    const powerUpType = type === '⭐' ? 'doublePoints' : type === '⏰' ? 'extraTime' : 'bonus';
    try {
      const res = await fetch('/api/submitAnswer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          powerUpType,
          answerHash,
          timestamp: questionTimestamp // Add this
        }),
      });
      const data = await res.json();
      
      // Show power-up animation
      setPowerUpMessage(type === '⭐' ? 'DOUBLE POINTS!' : 'EXTRA TIME!');
      setShowPowerUpAlert(true);
      setTimeout(() => setShowPowerUpAlert(false), 1500);
      
      if (data.error) {
        console.error('Power-up error:', data.error);
        return;
      }
      
      if (data.timeBonus) {
        setTimeLeft(t => t + data.timeBonus);
      }
      if (typeof data.serverScore === 'number') {
        setServerScore(data.serverScore);
      }
    } catch (error) {
      console.error('Power-up error:', error);
    }
  };

  const handleAnswer = async (option) => {
    setSelectedOption(option);
    const res = await fetch('/api/submitAnswer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        selectedOption: option, 
        answerHash,
        timestamp: questionTimestamp
      }),
    });
    const data = await res.json();
    
    setIsCorrectAnswer(data.correct);
    setServerScore(data.serverScore);
    setStreak(data.streak);
    
    if (data.correct) {
      setCorrectAnswers(prev => [...prev, { 
        answer: option,
        timestamp: Date.now()
      }]);
      // Show streak animation for correct answers with streak >= 2
      if (data.streak >= 2) {
        setShowStreak(true);
        setTimeout(() => setShowStreak(false), 1500); // Longer display time
      }
    }
    
    console.log('Debug:', data.debug); // Add this for debugging
    
    setShowFeedback(true);
    setTimeout(() => {
      fetchQuestion();
      setIsCorrectAnswer(null);
    }, 1000);
  };

  return (
    <div className="text-center p-8 max-w-4xl mx-auto christmas-card relative">
      <PowerUps onPowerUpClick={handlePowerUp} />
      <div className="text-gold text-4xl mb-4 font-display">
        ❄️🎄 Emoji Quiz for HC 🎄⛄
      </div>
      <h1 className="text-8xl mb-12 animate-bounce-slow">{question}</h1>
      
      {showStreak && streak >= 2 && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-8xl font-bold text-neon-purple animate-streak z-50">
            {streak}x COMBO!
          </div>
        </div>
      )}
      
      {showPowerUpAlert && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-8xl font-bold text-gold animate-streak z-50">
            {powerUpMessage} {powerUpMessage === 'DOUBLE POINTS!' ? '⭐' : '⏰'}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {options.map((option, index) => {
          let buttonClass = 'game-button';
          if (showFeedback) {
            if (option === selectedOption && isCorrectAnswer) {
              buttonClass = 'game-button bg-holiday-green border-gold';
            } else if (option === selectedOption && !isCorrectAnswer) {
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
          <span className="ml-2 text-candy-red">{serverScore}</span>
        </div>
        <div className="text-2xl font-game">
          <span className="text-gold">Time:</span>
          <span className="ml-2 text-snow-white">{timeLeft}s</span>
        </div>
        <div className="text-2xl font-game">
          <span className="text-gold">Streak:</span>
          <span className="ml-2 text-holiday-green">{streak}🔥</span>
        </div>
      </div>
      
      {/* Add debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 left-0 bg-black/50 text-xs p-2 text-white">
          Answers: {correctAnswers.length} | Score: {serverScore} | Streak: {streak}
        </div>
      )}
      
    </div>
  );
}