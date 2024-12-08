import { supabase } from '../../lib/supabaseClient';

export default async (req, res) => {
  const { name, score } = req.body;

  if (req.method === 'POST') {
    try {
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