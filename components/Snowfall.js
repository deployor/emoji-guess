import { useState, useEffect } from 'react';

// TODO: Fix emojis sticking to the top on start

export default function Snowfall() {
  const [isClient, setIsClient] = useState(false);
  const decorations = ['❄️', '🎄', '🎅', '🎁', '⭐']; // TODO: ADD MOREEEE

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(50)].map((_, i) => {
        const left = `${Math.floor(Math.random() * 100)}%`;
        const delay = `${Math.floor(Math.random() * 5)}s`;
        
        return (
          <div
            key={`snow-${i}-${left}`}
            className={`absolute -top-4 
              ${i % 5 === 4 ? 'text-2xl animate-snow-slow' : 'rounded-full bg-snow-white/30'}
              ${i % 3 === 0 ? 'w-1 h-1 animate-snow-fast' : ''}
              ${i % 3 === 1 ? 'w-2 h-2 animate-snow-medium' : ''}
              ${i % 3 === 2 ? 'w-3 h-3 animate-snow-slow' : ''}
            `}
            style={{
              left,
              animationDelay: delay,
            }}
          >
            {i % 5 === 4 ? decorations[Math.floor(i / 5) % decorations.length] : ''}
          </div>
        );
      })}
    </div>
  );
}