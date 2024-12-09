import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-30">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-2xl bg-gray-800/50 p-2 rounded-lg hover:bg-gray-800/70"
      >
        {isOpen ? '❌' : (
          <div className="flex flex-col gap-1">
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 bg-gray-900/95 rounded-lg p-4 min-w-[200px] backdrop-blur-sm border border-gold/20">
          <nav className="space-y-2">
            <Link href="/" className="nav-link">
              🎮 Play Game
            </Link>
            <Link href="/how-to-play" className="nav-link">
              📖 How to Play
            </Link>
            <Link href="/stats" className="nav-link">
              📊 Your Stats
            </Link>
            <Link href="/settings" className="nav-link">
              ⚙️ Settings
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}