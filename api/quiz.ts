// Vercel Serverless Function: GET /api/quiz, POST /api/quiz
import { getQuizData, saveQuizData, parseRequestBody } from './_db';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-owner-passcode');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const quiz = await getQuizData();
    return res.status(200).json(quiz);
  }

  if (req.method === 'POST') {
    const body = await parseRequestBody(req);
    const passcode = req.headers['x-owner-passcode'] || body?.passcode;
    if (String(passcode).toLowerCase() !== 'anurag') {
      return res.status(403).json({ error: 'Unauthorized. Passcode required.' });
    }

    const updatedQuiz = body?.quiz;
    if (!updatedQuiz || !updatedQuiz.questions) {
      return res.status(400).json({ error: 'Invalid quiz payload' });
    }

    await saveQuizData(updatedQuiz);
    return res.status(200).json({ success: true, quiz: updatedQuiz });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
