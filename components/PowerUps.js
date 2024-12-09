import { useState, useEffect } from 'react';

export default function PowerUps({ onPowerUpClick }) {
  const [powerUps, setPowerUps] = useState([]);
  const powerUpTypes = ['⭐', '⏰'];

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1 && powerUps.length < 1) {
        const newPowerUp = {
          id: Date.now(),
          type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)],
          left: `${Math.floor(Math.random() * 90)}%`,
          speed: 8 + Math.floor(Math.random() * 4), // fall speed
          wobble: Math.random() > 0.5 // 50% chance to wobble wobble wobble :)
        };
        setPowerUps(prev => [...prev, newPowerUp]);

        setTimeout(() => {
          setPowerUps(prev => prev.filter(p => p.id !== newPowerUp.id));
        }, 8000);
      }
    }, 4000); // frequentlyicy

    return () => clearInterval(interval);
  }, [powerUps.length]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {powerUps.map((powerUp) => (
        <button
          key={powerUp.id}
          onClick={() => {
            onPowerUpClick(powerUp.type);
            setPowerUps(prev => prev.filter(p => p.id !== powerUp.id));
          }}
          className="absolute -top-8 pointer-events-auto cursor-pointer hover:scale-125"
          style={{
            left: powerUp.left,
            animation: `${powerUp.wobble ? 'fallAndWobble' : 'quickFall'} ${powerUp.speed}s linear`,
            fontSize: '1.5rem',
            padding: '0.5rem',
            transition: 'transform 0.1s',
          }}
        >
          {powerUp.type}
        </button>
      ))}
    </div>
  );
}
