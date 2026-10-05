import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Persistent data directory
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const LEADERBOARD_FILE = path.join(DATA_DIR, 'leaderboard.json');
const QUIZ_FILE = path.join(DATA_DIR, 'quiz.json');

// Default starter questions for Anurag
const DEFAULT_QUIZ = {
  id: 'anurag_official_quiz',
  creatorName: 'anurag',
  createdAt: Date.now(),
  theme: 'pastel-blue',
  questions: [
    {
      id: 'q_on_read',
      question: 'If you leave anurag on read for 24 hours, what will they do?',
      options: [
        { id: 'opt_1', text: 'Spam 50 memes and random TikToks anyway', emoji: '📱' },
        { id: 'opt_2', text: 'Overthink and assume you secretly hate me', emoji: '🥺' },
        { id: 'opt_3', text: 'Instantly block you out of spite', emoji: '🚫' },
        { id: 'opt_4', text: 'Forget that I even texted you honestly', emoji: '😴' },
      ],
      correctAnswerId: 'opt_1',
    },
    {
      id: 'q_pet_peeve',
      question: "What is anurag's absolute BIGGEST friendship pet peeve?",
      options: [
        { id: 'opt_1', text: 'Chewing loudly or eating my fries without asking', emoji: '🍟' },
        { id: 'opt_2', text: 'Canceling plans when I am already dressed up', emoji: '👗' },
        { id: 'opt_3', text: 'Being glued to your phone while I am talking', emoji: '📵' },
        { id: 'opt_4', text: 'Replying with dry "k" or thumbs up emoji', emoji: '💀' },
      ],
      correctAnswerId: 'opt_2',
    },
    {
      id: 'q_bad_mood',
      question: 'If anurag is in an awful mood, what is the fastest fix?',
      options: [
        { id: 'opt_1', text: 'Bring me iced coffee / boba & tasty snacks', emoji: '🧋' },
        { id: 'opt_2', text: 'Listen to me rant without giving unsolicited advice', emoji: '🗣️' },
        { id: 'opt_3', text: 'Send me hilarious unhinged brainrot reels', emoji: '🤣' },
        { id: 'opt_4', text: 'Leave me alone in my blanket burrito cave', emoji: '🌯' },
      ],
      correctAnswerId: 'opt_1',
    },
    {
      id: 'q_block_reason',
      question: 'Why would anurag ACTUALLY block someone on social media?',
      options: [
        { id: 'opt_1', text: 'Spreading gossip or talking behind my back', emoji: '🐍' },
        { id: 'opt_2', text: 'Extreme clinginess / spamming calls nonstop', emoji: '📞' },
        { id: 'opt_3', text: 'Constant negative victim energy & bad vibes', emoji: '☁️' },
        { id: 'opt_4', text: 'Borrowing my favorite clothes and never returning them', emoji: '🧥' },
      ],
      correctAnswerId: 'opt_1',
    },
    {
      id: 'q_canceling_plans',
      question: 'How does anurag secretly feel when you cancel plans last minute?',
      options: [
        { id: 'opt_1', text: 'Secretly overjoyed because I wanted to stay home in pajamas', emoji: '🛋️' },
        { id: 'opt_2', text: 'Furious because my outfit and hair were already done', emoji: '😤' },
        { id: 'opt_3', text: 'Relieved, but pretend to be disappointed to be polite', emoji: '😇' },
        { id: 'opt_4', text: 'Taking it personally and questioning our friendship', emoji: '🤔' },
      ],
      correctAnswerId: 'opt_1',
    },
  ],
};

function readJSON<T>(file: string, fallback: T): T {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
  }
  return fallback;
}

function writeJSON<T>(file: string, data: T): void {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
  }
}

// ---------------- REST API Endpoints ---------------- //

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', serverTime: Date.now() });
});

// GET /api/leaderboard - Get all players ranked by score
app.get('/api/leaderboard', (_req, res) => {
  const leaderboard = readJSON<Array<Record<string, unknown>>>(LEADERBOARD_FILE, []);
  // Sort highest score first, then newest
  const sorted = [...leaderboard].sort((a, b) => {
    const scoreDiff = (Number(b.score) || 0) - (Number(a.score) || 0);
    if (scoreDiff !== 0) return scoreDiff;
    return (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0);
  });
  res.json(sorted);
});

// POST /api/results - Save a player's score & bonus thoughts
app.post('/api/results', (req, res) => {
  const {
    playerName,
    score,
    total,
    percentage,
    answers,
    bonusThoughts,
    bonusTags,
  } = req.body;

  if (!playerName || typeof score !== 'number' || typeof total !== 'number') {
    res.status(400).json({ error: 'Missing required attempt fields' });
    return;
  }

  const newAttempt = {
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

  const leaderboard = readJSON<Array<Record<string, unknown>>>(LEADERBOARD_FILE, []);
  // Avoid duplicate exact attempts
  const updated = [newAttempt, ...leaderboard.filter((a) => a.id !== newAttempt.id)];
  writeJSON(LEADERBOARD_FILE, updated);

  res.status(201).json({ success: true, attempt: newAttempt });
});

// DELETE /api/leaderboard - Reset leaderboard (passcode protected)
app.delete('/api/leaderboard', (req, res) => {
  const passcode = req.headers['x-owner-passcode'] || req.body?.passcode;
  if (String(passcode).toLowerCase() !== 'anurag') {
    res.status(403).json({ error: 'Unauthorized. Passcode required.' });
    return;
  }

  writeJSON(LEADERBOARD_FILE, []);
  res.json({ success: true, message: 'Leaderboard reset successfully' });
});

// GET /api/quiz - Get the current quiz config
app.get('/api/quiz', (_req, res) => {
  const quiz = readJSON(QUIZ_FILE, DEFAULT_QUIZ);
  res.json(quiz);
});

// POST /api/quiz - Save updated quiz config
app.post('/api/quiz', (req, res) => {
  const passcode = req.headers['x-owner-passcode'] || req.body?.passcode;
  if (String(passcode).toLowerCase() !== 'anurag') {
    res.status(403).json({ error: 'Unauthorized. Passcode required.' });
    return;
  }

  const updatedQuiz = req.body.quiz;
  if (!updatedQuiz || !updatedQuiz.questions) {
    res.status(400).json({ error: 'Invalid quiz payload' });
    return;
  }

  writeJSON(QUIZ_FILE, updatedQuiz);
  res.json({ success: true, quiz: updatedQuiz });
});

// ---------------- Vite / Static Middleware ---------------- //

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
