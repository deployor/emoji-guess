
export default function HowToPlay() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto christmas-card">
        <h1 className="title-text text-4xl mb-8">How to Play 🎮</h1>
        
        <div className="space-y-6 text-left">
          <section className="bg-gray-800/30 p-4 rounded-lg">
            <h2 className="text-gold text-2xl mb-2">🎯 Basic Rules</h2>
            <p>Guess what the emoji represents before time runs out!</p>
          </section>

          <section className="bg-gray-800/30 p-4 rounded-lg">
            <h2 className="text-gold text-2xl mb-2">⭐ Power-Ups</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>⭐ Double Points: Next correct answer worth 2x</li>
              <li>⏰ Extra Time: Adds 10 seconds to the clock</li>
            </ul>
          </section>

          <section className="bg-gray-800/30 p-4 rounded-lg">
            <h2 className="text-gold text-2xl mb-2">🔥 Streaks</h2>
            <p>Get consecutive correct answers to build your streak multiplier!</p>
          </section>
        </div>

        <a href="/" className="game-button inline-block mt-8">
          Back to Game 🎮
        </a>
      </div>
    </div>
  );
}