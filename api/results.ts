// Vercel Serverless Function: POST /api/results
import { saveAttemptData, parseRequestBody, AttemptData } from './_db';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const body = await parseRequestBody(req);
    const {
      playerName,
      score,
      total,
      percentage,
      answers,
      bonusThoughts,
      bonusTags,
    } = body || {};

    if (!playerName || typeof score !== 'number' || typeof total !== 'number') {
      return res.status(400).json({ error: 'Missing required attempt fields' });
    }

    const newAttempt: AttemptData = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      playerName: String(playerName).trim().slice(0, 20),
      score,
      total,
      percentage: typeof percentage === 'number' ? percentage : Math.round((score / total) * 100),
      answers: answers || {},
      bonusThoughts: bonusThoughts ? String(bonusThoughts).trim().slice(0, 500) : undefined,
      bonusTags: Array.isArray(bonusTags) ? bonusTags : undefined,
      timestamp: Date.now(),
    };

    await saveAttemptData(newAttempt);

    return res.status(201).json({ success: true, attempt: newAttempt });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
