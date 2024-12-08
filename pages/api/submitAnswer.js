import crypto from 'crypto';

export default (req, res) => {
  if (req.method === 'POST') {
    const { selectedOption, answerHash } = req.body;

    // Create hash of the selected answer
    const selectedHash = crypto
      .createHash('sha256')
      .update(selectedOption + process.env.SESSION_PASSWORD)
      .digest('hex');

    // Compare hashes
    const isCorrect = selectedHash === answerHash;
    res.status(200).json({ correct: isCorrect });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};