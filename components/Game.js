import { useState, useEffect } from 'react';
import { security } from '../lib/security';

export default function Game({ onGameEnd }) {
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [questionToken, setQuestionToken] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(parseInt(process.env.NEXT_PUBLIC_TIMER_DURATION));
  const [selectedOption, setSelectedOption] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [clientData, setClientData] = useState({
    mouseMovements: 0,
    keyPresses: 0,
    focusTime: 0,
    clickPattern: []
  });
  const [deviceData, setDeviceData] = useState({
    accelerometer: null,
    touchEvents: [],
    screenOrientation: null,
    deviceMemory: navigator?.deviceMemory,
    hardwareConcurrency: navigator?.hardwareConcurrency
  });

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onGameEnd(score, correctAnswers);
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const trackBehavior = () => {
      setClientData(prev => ({
        ...prev,
        mouseMovements: prev.mouseMovements + 1
      }));
    };
    
    const trackKeyPress = () => {
      setClientData(prev => ({
        ...prev,
        keyPresses: prev.keyPresses + 1
      }));
    };

    window.addEventListener('mousemove', trackBehavior);
    window.addEventListener('keydown', trackKeyPress);

    return () => {
      window.removeEventListener('mousemove', trackBehavior);
      window.removeEventListener('keydown', trackKeyPress);
    };
  }, []);

  useEffect(() => {
    // Request device sensors
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    
    // Track touch dynamics
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('touchend', handleTouch);

    return () => {
      // ...cleanup listeners...
    };
  }, []);

  const startGame = async () => {
    const res = await fetch('/api/startGame', { method: 'POST' });
    const data = await res.json();
    setSessionId(data.sessionId);
    fetchQuestion();
  };

  const fetchQuestion = async () => {
    const res = await fetch('/api/getQuestion');
    const data = await res.json();
    setQuestion(data.emoji);
    setOptions(data.options);
    setQuestionToken(data.questionToken);
    setSelectedOption('');
    setShowFeedback(false);
  };

  const handleAnswer = async (option) => {
    setSelectedOption(option);
    const signature = security.sign({
      answer: option,
      questionToken,
      timestamp: Date.now(),
      nonce: Math.random().toString(36)
    }, process.env.NEXT_PUBLIC_CLIENT_KEY);

    const requestData = security.watermarkRequest({
      answer: option,
      questionToken,
      signature,
      clientData: {
        ...clientData,
        ...deviceData
      }
    });

    const res = await fetch('/api/submitAnswer', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Device-Fingerprint': await generateDeviceFingerprint()
      },
      body: JSON.stringify(requestData)
    });
    const data = await res.json();
    setScore(data.score);
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