import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get total games
    const { count: totalGames } = await supabase
      .from('games')
      .select('*', { count: 'exact' });

    // Get total players (unique user_ids)
    const { count: totalPlayers } = await supabase
      .from('games')
      .select('user_id', { count: 'exact', distinct: true });

    // Get scores for average and highest
    const { data: scores } = await supabase
      .from('games')
      .select('score');

    let averageScore = 0;
    let highestScore = 0;

    if (scores && scores.length > 0) {
      averageScore = scores.reduce((acc, game) => acc + game.score, 0) / scores.length;
      highestScore = Math.max(...scores.map(game => game.score));
    }

    // Get highest streak
    const { data: streakData } = await supabase
      .from('games')
      .select('streak')
      .order('streak', { ascending: false })
      .limit(1);

    const longestStreak = streakData?.[0]?.streak || 0;

    return res.status(200).json({
      totalGames: totalGames || 0,
      totalPlayers: totalPlayers || 0,
      averageScore,
      highestScore,
      longestStreak
    });
  } catch (error) {
    console.error('Error fetching global stats:', error);
    return res.status(500).json({ error: 'Failed to fetch global stats' });
  }
}