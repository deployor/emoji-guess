import { supabase } from '../../lib/supabaseClient';
import { gameStates, calculateScore } from './submitAnswer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, sessionId } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Missing session ID' });
  }

  const gameState = gameStates.get(sessionId);
  
  if (!gameState) {
    return res.status(400).json({ error: 'Invalid session' });
  }

  const score = calculateScore(gameState);
  const MAX_POSSIBLE_SCORE = parseInt(process.env.NEXT_PUBLIC_TIMER_DURATION) * 2;
  
  if (score > MAX_POSSIBLE_SCORE) {
    return res.status(400).json({ error: 'Invalid score' });
  }

  try {
    const { data, error } = await supabase
      .from('scores')
      .insert([{ 
        name: name.slice(0, 50),
        score,
        verified: true,
        answers_count: gameState.correctAnswers.length,
        average_response_time: gameState.correctAnswers.length > 0 ? 
          gameState.correctAnswers.reduce((acc, curr, idx) => 
            idx > 0 ? acc + (curr.timestamp - gameState.correctAnswers[idx-1].timestamp) : acc
          , 0) / (gameState.correctAnswers.length - 1) : 0
      }])
      .select();

    if (error) throw error;
    gameStates.delete(sessionId); // Cleanup
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save score' });
  }
}