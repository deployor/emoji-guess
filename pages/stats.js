import { useState, useEffect } from 'react';

export default function Stats() {
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/getGlobalStats')
      .then(res => res.json())
      .then(data => {
        setGlobalStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen p-8 text-center">Loading stats...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto christmas-card">
        <h1 className="title-text text-4xl mb-8">📊 Global Stats</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <StatsCard title="Total Games" value={globalStats?.totalGames || 0} icon="🎮" />
          <StatsCard title="Total Players" value={globalStats?.totalPlayers || 0} icon="👥" />
          <StatsCard title="Average Score" value={globalStats?.averageScore ? Math.round(globalStats.averageScore) : 0} icon="⭐" />
          <StatsCard title="Highest Score" value={globalStats?.highestScore || 0} icon="🏆" />
        </div>

        <div className="bg-gray-800/30 p-6 rounded-lg">
          <h2 className="text-gold text-2xl mb-4">⚡ Fun Facts</h2>
          <ul className="space-y-2">
            <li>Longest Streak: {globalStats?.longestStreak || 0}🔥</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon }) {
  return (
    <div className="bg-gray-800/30 p-4 rounded-lg text-center hover:scale-105 transition-transform">
      <span className="text-3xl mb-2 block">{icon}</span>
      <h3 className="text-gold">{title}</h3>
      <p className="text-2xl font-game">{value}</p>
    </div>
  );
}