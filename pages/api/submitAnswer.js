import { getServerSession } from '../../lib/session'
import { createHash } from 'crypto'
import { security } from '../../lib/security';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req);
  if (!session?.gameState?.currentQuestion) {
    return res.status(403).json({ error: 'No active question' });
  }

  const { answer, questionToken, signature, timestamp, clientData } = req.body;

  // Verify request signature matches original response
  if (!session.gameState.lastResponse ||
      !security.verify({
        answer,
        questionToken,
        timestamp: session.gameState.lastResponse.timestamp,
        nonce: session.gameState.lastResponse.nonce
      }, signature, process.env.SECRET_KEY)) {
    return res.status(403).json({ error: 'Invalid request signature' });
  }

  // Verify request watermark
  if (!security.verifyWatermark(req.body)) {
    return res.status(403).json({ error: 'Invalid request watermark' });
  }

  // Behavioral analysis
  if (!clientData || !validateClientBehavior(clientData)) {
    return res.status(403).json({ error: 'Suspicious behavior detected' });
  }

  // Advanced behavioral analysis
  const behaviorValid = security.validateBehaviorPatterns(clientData);
  if (!behaviorValid) {
    return res.status(403).json({ error: 'Suspicious behavior detected' });
  }

  // Network fingerprint validation
  if (!security.analyzeRequest(req)) {
    return res.status(403).json({ error: 'Invalid network fingerprint' });
  }

  // Progressive delay for wrong answers
  if (session.gameState.wrongAnswers > 2) {
    const delay = Math.min(5000, session.gameState.wrongAnswers * 1000);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // Verify question token hasn't been tampered with
  const expectedToken = createHash('sha256')
    .update(`${session.id}:${session.gameState.currentQuestion.id}:${session.gameState.currentQuestion.answer}:${process.env.SECRET_KEY}`)
    .digest('hex');

  if (questionToken !== expectedToken) {
    return res.status(403).json({ error: 'Invalid question token' });
  }

  // Verify answer timing
  const answerTime = Date.now() - session.gameState.currentQuestion.timeIssued;
  if (answerTime < 500 || answerTime > 10000) { // Between 0.5s and 10s
    return res.status(403).json({ error: 'Invalid answer timing' });
  }

  const isCorrect = answer === session.gameState.currentQuestion.answer;
  if (isCorrect) {
    session.gameState.score += 1;
    session.gameState.wrongAnswers = 0;
    session.gameState.questionHistory.push({
      id: session.gameState.currentQuestion.id,
      answer,
      timeSpent: answerTime
    });
  } else {
    session.gameState.wrongAnswers = (session.gameState.wrongAnswers || 0) + 1;
  }

  // Encrypt response
  const responseData = security.encrypt({
    correct: isCorrect,
    score: session.gameState.score
  }, process.env.SECRET_KEY);

  res.setHeader('X-Response-Integrity', security.sign(responseData, process.env.SECRET_KEY));
  res.status(200).json(responseData);
}

function validateClientBehavior(clientData) {
  const {
    mouseMovements,
    keyPresses,
    focusTime,
    clickPattern
  } = clientData;

  // Minimum required human-like behavior
  return mouseMovements > 0 &&
         keyPresses < 100 &&
         focusTime > 200 &&
         clickPattern.length > 0;
}