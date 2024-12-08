import { supabase } from '../../lib/supabaseClient';

export default async (req, res) => {
  const { name, score } = req.body;

  if (req.method === 'POST') {
    try {
      // Validate score server-side
      const { data: questions, error: questionError } = await supabase
        .from('questions')
        .select('id, answer')
        .in('id', correctAnswers.map(answer => answer.questionId));

      if (questionError) throw questionError;

      const validScore = correctAnswers.reduce((acc, answer) => {
        const question = questions.find(q => q.id === answer.questionId);
        return acc + (question && question.answer === answer.answer ? 1 : 0);
      }, 0);

      if (validScore !== score) {
        return res.status(400).json({ error: 'Invalid score' });
      }

      const { data, error } = await supabase
        .from('scores')
        .insert([{ name, score }])
        .select();

      if (error) throw error;

      res.status(200).json(data[0]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save score' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};