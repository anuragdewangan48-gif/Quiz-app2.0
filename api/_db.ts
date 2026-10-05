// Serverless Storage Engine for Vercel Serverless Functions
// Supports Vercel KV / Upstash Redis, Filesystem (in local dev), and In-Memory fallback

export interface AttemptData {
  id: string;
  playerName: string;
  score: number;
  total: number;
  percentage: number;
  answers?: Record<string, string>;
  bonusThoughts?: string;
  bonusTags?: string[];
  timestamp: number;
}

export interface QuizConfigData {
  id: string;
  creatorName: string;
  createdAt: number;
  theme?: string;
  questions: Array<{
    id: string;
    question: string;
    options: Array<{ id: string; text: string; emoji?: string }>;
    correctAnswerId: string;
    explanation?: string;
  }>;
}

const DEFAULT_QUIZ: QuizConfigData = {
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

// In-memory global store across warm serverless invocations
let memoryLeaderboard: AttemptData[] = [];
let memoryQuiz: QuizConfigData = DEFAULT_QUIZ;

function getKvConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return { url, token };
  }
  return null;
}

async function kvCommand(command: string[]): Promise<any> {
  const kv = getKvConfig();
  if (!kv) return null;
  try {
    const res = await fetch(kv.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kv.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) return null;
    const json: any = await res.json();
    return json?.result;
  } catch (err) {
    console.warn('KV command error:', err);
    return null;
  }
}

export async function getLeaderboardData(): Promise<AttemptData[]> {
  const kv = getKvConfig();
  if (kv) {
    const res = await kvCommand(['GET', 'bestieblock_leaderboard']);
    if (res) {
      try {
        const parsed = typeof res === 'string' ? JSON.parse(res) : res;
        if (Array.isArray(parsed)) {
          memoryLeaderboard = parsed;
          return parsed;
        }
      } catch {}
    }
  }

  // Filesystem check (e.g. In local development server.ts)
  try {
    const fs = await import('fs');
    const path = await import('path');
    const dataFile = path.join(process.cwd(), 'data', 'leaderboard.json');
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryLeaderboard = parsed;
        return parsed;
      }
    }
  } catch {}

  return memoryLeaderboard;
}

export async function saveAttemptData(attempt: AttemptData): Promise<AttemptData> {
  const current = await getLeaderboardData();
  const updated = [attempt, ...current.filter((item) => item.id !== attempt.id)];
  memoryLeaderboard = updated;

  const kv = getKvConfig();
  if (kv) {
    await kvCommand(['SET', 'bestieblock_leaderboard', JSON.stringify(updated)]);
  }

  // Filesystem write if available
  try {
    const fs = await import('fs');
    const path = await import('path');
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(path.join(dataDir, 'leaderboard.json'), JSON.stringify(updated, null, 2), 'utf-8');
  } catch {}

  return attempt;
}

export async function clearLeaderboardData(): Promise<void> {
  memoryLeaderboard = [];
  const kv = getKvConfig();
  if (kv) {
    await kvCommand(['DEL', 'bestieblock_leaderboard']);
  }
  try {
    const fs = await import('fs');
    const path = await import('path');
    const dataFile = path.join(process.cwd(), 'data', 'leaderboard.json');
    if (fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch {}
}

export async function getQuizData(): Promise<QuizConfigData> {
  const kv = getKvConfig();
  if (kv) {
    const res = await kvCommand(['GET', 'bestieblock_quiz']);
    if (res) {
      try {
        const parsed = typeof res === 'string' ? JSON.parse(res) : res;
        if (parsed && parsed.questions) {
          memoryQuiz = parsed;
          return parsed;
        }
      } catch {}
    }
  }

  try {
    const fs = await import('fs');
    const path = await import('path');
    const dataFile = path.join(process.cwd(), 'data', 'quiz.json');
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && parsed.questions) {
        memoryQuiz = parsed;
        return parsed;
      }
    }
  } catch {}

  return memoryQuiz;
}

export async function saveQuizData(quiz: QuizConfigData): Promise<void> {
  memoryQuiz = quiz;
  const kv = getKvConfig();
  if (kv) {
    await kvCommand(['SET', 'bestieblock_quiz', JSON.stringify(quiz)]);
  }
  try {
    const fs = await import('fs');
    const path = await import('path');
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(path.join(dataDir, 'quiz.json'), JSON.stringify(quiz, null, 2), 'utf-8');
  } catch {}
}

export async function parseRequestBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {}
  }
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}
