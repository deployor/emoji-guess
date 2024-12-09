import crypto from 'crypto';

export const gameStates = new Map();

// Simplified timing constants
const COOLDOWNS = {
  powerUp: 3000,    // 3 seconds between power-ups
  answer: 300       // 300ms between answers
};

const VALID_ANSWER_WINDOW = 50000; // 50 seconds to answer

function verifyAnswer(answer, hash, timestamp) {
  // Verify timestamp is recent
  if (Date.now() - timestamp > VALID_ANSWER_WINDOW) {
    return false;
  }

  const calculatedHash = crypto
    .createHash('sha256')
    .update(answer + process.env.ANSWER_SECRET + timestamp)
    .digest('hex');
  return calculatedHash === hash;
}

function handlePowerUp(gameState, type) {
  const now = Date.now();
  const lastPowerUpTime = gameState.lastPowerUpTime || 0;
  
  if (now - lastPowerUpTime < COOLDOWNS.powerUp) {
    return false;
  }

  if (type === 'doublePoints') {
    gameState.score = Math.max(1, gameState.correctAnswers.length || 0) * 2;
  } else if (type === 'extraTime') {
    gameState.timeBonus = (gameState.timeBonus || 0) + 10;
  }
  
  gameState.lastPowerUpTime = now;
  return true;
}

export function calculateScore(gameState) {
  let score = 0;
  let lastTimestamp = 0;
  
  for (const answer of gameState.correctAnswers) {
    // Verify answer timestamps are sequential and reasonable
    if (lastTimestamp && (
      answer.timestamp <= lastTimestamp || 
      answer.timestamp - lastTimestamp < 500 ||
      answer.timestamp - lastTimestamp > 10000
    )) {
      continue; // Skip suspicious answers
    }
    
    lastTimestamp = answer.timestamp;
    score += answer.multiplier || 1;
  }
  
  return score;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { selectedOption, answerHash, powerUpType, timestamp } = req.body;
  const sessionId = req.cookies['session-id'] || crypto.randomBytes(16).toString('hex');

  // Initialize game state if needed
  if (!gameStates.has(sessionId)) {
    gameStates.set(sessionId, { 
      correctAnswers: [], 
      streak: 0,
      score: 0,
      timeBonus: 0,
      lastPowerUpTime: 0,
      lastAnswerTime: 0
    });
  }

  const gameState = gameStates.get(sessionId);
  const now = Date.now();

  // Simple cooldown check using timestamps
  const lastActionTime = powerUpType ? gameState.lastPowerUpTime : gameState.lastAnswerTime;
  const requiredCooldown = powerUpType ? COOLDOWNS.powerUp : COOLDOWNS.answer;

  if (lastActionTime && now - lastActionTime < requiredCooldown) {
    return res.status(429).json({ 
      error: 'Too many requests',
      waitTime: requiredCooldown - (now - lastActionTime)
    });
  }

  // Handle power-up or answer
  if (powerUpType) {
    const powerUpSuccess = handlePowerUp(gameState, powerUpType);
    if (!powerUpSuccess) {
      return res.status(400).json({ error: 'Power-up cooldown' });
    }
    // Add response for successful power-up
    return res.status(200).json({
      serverScore: calculateScore(gameState),
      timeBonus: gameState.timeBonus || 0,
      success: true
    });
  } else {
    const isCorrect = verifyAnswer(selectedOption, answerHash, timestamp);

    if (isCorrect) {
      gameState.correctAnswers.push({
        answer: selectedOption,
        wasStreak: gameState.streak >= 2,
        timestamp: Date.now(),
        multiplier: gameState.streak >= 3 ? 2 : 1  // Store the multiplier with the answer
      });
      gameState.streak++;
    } else {
      gameState.streak = 0;
    }

    const score = calculateScore(gameState);

    gameState.lastAnswerTime = now;

    res.setHeader('Set-Cookie', `session-id=${sessionId}; Path=/; HttpOnly; SameSite=Strict`);
    res.status(200).json({ 
      correct: isCorrect,
      serverScore: score,
      streak: gameState.streak,
      timeBonus: gameState.timeBonus || 0,
      debug: {
        answersCount: gameState.correctAnswers.length,
        sessionId: sessionId.slice(0, 8) + '...'
      }
    });
  }
}
