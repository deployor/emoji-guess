import { useState, useEffect } from 'react';

export default function Settings() {
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    const savedMusic = localStorage.getItem('musicEnabled');
    const savedVolume = localStorage.getItem('musicVolume');
    if (savedMusic !== null) {
      setIsMusicEnabled(JSON.parse(savedMusic));
    }
    if (savedVolume !== null) {
      setVolume(JSON.parse(savedVolume));
    }
  }, []);

  const toggleMusic = () => {
    const newValue = !isMusicEnabled;
    setIsMusicEnabled(newValue);
    localStorage.setItem('musicEnabled', JSON.stringify(newValue));
    window.dispatchEvent(new Event('musicSettingChanged'));
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    localStorage.setItem('musicVolume', JSON.stringify(newVolume));
    window.dispatchEvent(new CustomEvent('volumeChanged', { detail: newVolume }));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto christmas-card">
        <h1 className="title-text text-4xl mb-8">⚙️ Settings</h1>
        
        <div className="bg-gray-800/30 p-6 rounded-lg space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gold text-2xl">🎵 Background Music</h2>
              <p className="text-gray-400">Toggle game music on/off</p>
            </div>
            <button
              onClick={toggleMusic}
              className={`px-4 py-2 rounded-lg ${
                isMusicEnabled ? 'bg-holiday-green' : 'bg-candy-red'
              }`}
            >
              {isMusicEnabled ? '🔊 ON' : '🔇 OFF'}
            </button>
          </div>

          <div className="flex flex-col space-y-2">
            <h2 className="text-gold text-2xl">🔊 Volume</h2>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 rounded-lg appearance-none bg-gray-700 outline-none"
              />
              <span className="text-snow-white w-12">{volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}