import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { selectedOption, answerHash } = req.body;
  const computedHash = crypto
    .createHash('sha256')
    .update(selectedOption + process.env.SESSION_PASSWORD)
    .digest('hex');

  res.status(200).json({ correct: computedHash === answerHash });
}
