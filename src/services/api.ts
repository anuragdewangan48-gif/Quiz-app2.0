import { PlayerAttempt, QuizData } from '../types/quiz';
import {
  getMyQuiz as getLocalQuiz,
  saveMyQuiz as saveLocalQuiz,
  getGlobalLeaderboard as getLocalLeaderboard,
  savePlayerAttempt as saveLocalAttempt,
  clearGlobalLeaderboard as clearLocalLeaderboard,
  OWNER_PASSCODE,
} from '../utils/share';
import {
  isFirebaseActive,
  saveAttemptToFirestore,
  fetchQuizFromFirestore,
  saveQuizToFirestore,
  clearFirestoreLeaderboard,
  subscribeToFirestoreLeaderboard,
} from './firebase';

/**
 * Universal Data & Real-Time Sync Service:
 * Optimized for Vercel Serverless Architecture & direct Firebase Firestore real-time sync.
 *
 * 1. If Firebase Firestore is active:
 *    - Real-time snapshot listeners (onSnapshot) sync leaderboards instantaneously across all devices.
 *    - No server or persistent WebSocket needed at all!
 *
 * 2. If Vercel Serverless API is active:
 *    - Uses /api/results, /api/leaderboard, and /api/quiz with serverless KV/fallback.
 *    - Uses automatic polling intervals to ensure real-time score updates.
 *
 * 3. Graceful offline fallback:
 *    - Automatically caches to localStorage so the UI never breaks or flickers.
 */

export type UnsubscribeFn = () => void;

// 1. Live subscription to leaderboard (Firestore real-time snapshot OR clean polling)
export function subscribeToLiveLeaderboard(
  onUpdate: (attempts: PlayerAttempt[]) => void,
  pollingIntervalMs: number = 4000
): UnsubscribeFn {
  // If Firebase is active, use Firestore's onSnapshot real-time listener
  if (isFirebaseActive()) {
    const unsub = subscribeToFirestoreLeaderboard((attempts) => {
      // Keep localStorage in sync as backup
      localStorage.setItem('bestieblock_global_leaderboard', JSON.stringify(attempts));
      onUpdate(attempts);
    });

    if (unsub) {
      return unsub;
    }
  }

  // Fallback: Initial load + smart polling for Vercel Serverless API / Local
  let isMounted = true;

  const poll = async () => {
    try {
      const data = await fetchLeaderboard();
      if (isMounted && data) {
        onUpdate(data);
      }
    } catch (err) {
      console.warn('Leaderboard polling warning:', err);
    }
  };

  // Immediate initial load
  poll();

  const intervalId = setInterval(poll, pollingIntervalMs);

  return () => {
    isMounted = false;
    clearInterval(intervalId);
  };
}

// 2. Fetch live leaderboard
export async function fetchLeaderboard(): Promise<PlayerAttempt[]> {
  // 1. Try Vercel Serverless API
  try {
    const res = await fetch('/api/leaderboard');
    if (res.ok) {
      const data: PlayerAttempt[] = await res.json();
      if (Array.isArray(data)) {
        localStorage.setItem('bestieblock_global_leaderboard', JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Vercel API unavailable, checking local/Firestore cache:', err);
  }

  // 2. Fallback to cached local storage
  return getLocalLeaderboard();
}

// 3. Save player attempt & score
export async function submitQuizResult(
  attempt: Omit<PlayerAttempt, 'id' | 'timestamp'>
): Promise<PlayerAttempt> {
  const newId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const timestamp = Date.now();

  const fullAttempt: PlayerAttempt = {
    ...attempt,
    id: newId,
    timestamp,
  };

  // Always save locally first so user gets instant confirmation
  saveLocalAttempt(fullAttempt);

  // 1. Save directly to Firebase Firestore if configured (instant real-time broadcast)
  if (isFirebaseActive()) {
    try {
      await saveAttemptToFirestore(fullAttempt);
    } catch (err) {
      console.warn('Firestore attempt save failed:', err);
    }
  }

  // 2. Also submit to Vercel Serverless /api/results endpoint
  try {
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fullAttempt),
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.attempt) {
        saveLocalAttempt(json.attempt);
        return json.attempt as PlayerAttempt;
      }
    }
  } catch (err) {
    console.warn('Vercel API attempt save warning:', err);
  }

  return fullAttempt;
}

// 4. Reset leaderboard
export async function resetLeaderboardServer(passcode: string = OWNER_PASSCODE): Promise<boolean> {
  // Clear locally
  clearLocalLeaderboard();

  // Clear in Firebase if active
  if (isFirebaseActive()) {
    try {
      await clearFirestoreLeaderboard();
    } catch (err) {
      console.warn('Failed to clear Firestore leaderboard:', err);
    }
  }

  // Clear on Vercel Serverless API
  try {
    const res = await fetch('/api/leaderboard', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-passcode': passcode,
      },
      body: JSON.stringify({ passcode }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Serverless delete warning:', err);
  }

  return true;
}

// 5. Fetch live quiz configuration
export async function fetchQuizConfig(): Promise<QuizData> {
  // 1. Check Firebase Firestore if active
  if (isFirebaseActive()) {
    try {
      const firestoreQuiz = await fetchQuizFromFirestore();
      if (firestoreQuiz && firestoreQuiz.creatorName && Array.isArray(firestoreQuiz.questions)) {
        saveLocalQuiz(firestoreQuiz);
        return firestoreQuiz;
      }
    } catch (err) {
      console.warn('Firestore quiz fetch error:', err);
    }
  }

  // 2. Try Vercel Serverless /api/quiz endpoint
  try {
    const res = await fetch('/api/quiz');
    if (res.ok) {
      const data: QuizData = await res.json();
      if (data && data.creatorName && Array.isArray(data.questions)) {
        saveLocalQuiz(data);
        return data;
      }
    }
  } catch (err) {
    console.warn('Vercel API quiz fetch error:', err);
  }

  // 3. Fallback to local quiz config
  return getLocalQuiz();
}

// 6. Save updated quiz configuration
export async function saveQuizConfigServer(
  quiz: QuizData,
  passcode: string = OWNER_PASSCODE
): Promise<boolean> {
  // Always update locally first
  saveLocalQuiz(quiz);

  // Save to Firebase Firestore if active
  if (isFirebaseActive()) {
    try {
      await saveQuizToFirestore(quiz);
    } catch (err) {
      console.warn('Failed to save quiz to Firestore:', err);
    }
  }

  // Save to Vercel Serverless /api/quiz
  try {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-passcode': passcode,
      },
      body: JSON.stringify({ quiz, passcode }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Vercel API save warning, saved locally & Firestore:', err);
    return false;
  }
}
