
import { getServerSession } from '../../lib/session'
import { rateLimit } from '../../lib/rateLimit'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await rateLimit(req, res);
    const session = await getServerSession();
    
    // Initialize new game state in session
    session.gameState = {
      score: 0,
      timeStarted: Date.now(),
      questionHistory: [],
      currentQuestion: null
    };

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start game' });
  }
}