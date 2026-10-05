import { PlayerAttempt, QuizData } from '../types/quiz';
import {
  getMyQuiz as getLocalQuiz,
  saveMyQuiz as saveLocalQuiz,
  getGlobalLeaderboard as getLocalLeaderboard,
  savePlayerAttempt as saveLocalAttempt,
  clearGlobalLeaderboard as clearLocalLeaderboard,
  OWNER_PASSCODE,
} from '../utils/share';

/**
 * Robust API service that connects to the backend REST endpoints
 * with automatic fallback to client-side localStorage.
 */

// 1. Fetch live leaderboard
export async function fetchLeaderboard(): Promise<PlayerAttempt[]> {
  try {
    const res = await fetch('/api/leaderboard');
    if (res.ok) {
      const data: PlayerAttempt[] = await res.json();
      if (Array.isArray(data)) {
        // Also update local storage cache for instant offline fallback
        localStorage.setItem('bestieblock_global_leaderboard', JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend unavailable, using cached local leaderboard:', err);
  }

  // Fallback to local storage
  return getLocalLeaderboard();
}

// 2. Save player attempt & score
export async function submitQuizResult(attempt: Omit<PlayerAttempt, 'id' | 'timestamp'>): Promise<PlayerAttempt> {
  try {
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attempt),
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.attempt) {
        // Cache to local storage too
        saveLocalAttempt(json.attempt);
        return json.attempt as PlayerAttempt;
      }
    }
  } catch (err) {
    console.warn('Backend unavailable, saving attempt to local storage:', err);
  }

  // Fallback: save locally
  const fallbackAttempt: PlayerAttempt = {
    ...attempt,
    id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
  };
  saveLocalAttempt(fallbackAttempt);
  return fallbackAttempt;
}

// 3. Reset leaderboard
export async function resetLeaderboardServer(passcode: string = OWNER_PASSCODE): Promise<boolean> {
  try {
    const res = await fetch('/api/leaderboard', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-passcode': passcode,
      },
      body: JSON.stringify({ passcode }),
    });

    if (res.ok) {
      clearLocalLeaderboard();
      return true;
    }
  } catch (err) {
    console.warn('Backend error resetting leaderboard:', err);
  }

  // Fallback to local clear
  clearLocalLeaderboard();
  return true;
}

// 4. Fetch live quiz configuration
export async function fetchQuizConfig(): Promise<QuizData> {
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
    console.warn('Backend unavailable, using local quiz config:', err);
  }

  return getLocalQuiz();
}

// 5. Save updated quiz configuration
export async function saveQuizConfigServer(quiz: QuizData, passcode: string = OWNER_PASSCODE): Promise<boolean> {
  // Always update locally first for instant UI response
  saveLocalQuiz(quiz);

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
    console.warn('Backend unavailable, saved locally only:', err);
    return false;
  }
}
