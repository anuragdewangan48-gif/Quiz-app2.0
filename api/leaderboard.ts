// Vercel Serverless Function: GET /api/leaderboard, DELETE /api/leaderboard
import { getLeaderboardData, clearLeaderboardData, parseRequestBody } from './_db';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-owner-passcode');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const list = await getLeaderboardData();
    // Sort highest score first, then newest
    const sorted = [...list].sort((a, b) => {
      const scoreDiff = (Number(b.score) || 0) - (Number(a.score) || 0);
      if (scoreDiff !== 0) return scoreDiff;
      return (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0);
    });
    return res.status(200).json(sorted);
  }

  if (req.method === 'DELETE') {
    const body = await parseRequestBody(req);
    const passcode = req.headers['x-owner-passcode'] || body?.passcode;
    if (String(passcode).toLowerCase() !== 'anurag') {
      return res.status(403).json({ error: 'Unauthorized. Passcode required.' });
    }
    await clearLeaderboardData();
    return res.status(200).json({ success: true, message: 'Leaderboard reset' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
