import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  try {
    const { data: highScores, error } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (error) throw error;
    
    res.status(200).json(highScores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch high scores' });
  }
}