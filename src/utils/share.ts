import { QuizData, PlayerAttempt, FriendshipTier, TierInfo } from '../types/quiz';
import { getDefaultStarterQuiz } from '../data/defaultQuestions';

const MY_QUIZ_STORAGE_KEY = 'bestieblock_my_personal_quiz';
const LEADERBOARD_STORAGE_KEY = 'bestieblock_global_leaderboard';
const OWNER_AUTH_KEY = 'bestieblock_owner_authenticated';
export const OWNER_PASSCODE = 'anurag';

// Check if current user is Anurag (owner)
export function checkIsOwner(): boolean {
  try {
    return localStorage.getItem(OWNER_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

// Set owner authentication
export function setOwnerAuth(authenticated: boolean) {
  try {
    if (authenticated) {
      localStorage.setItem(OWNER_AUTH_KEY, 'true');
    } else {
      localStorage.removeItem(OWNER_AUTH_KEY);
    }
  } catch {}
}

// Get the user's specific personal quiz
export function getMyQuiz(): QuizData {
  try {
    const raw = localStorage.getItem(MY_QUIZ_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.creatorName && Array.isArray(parsed.questions)) {
        // If old placeholder name was stored, upgrade to anurag
        if (parsed.creatorName.toLowerCase() === 'sudeeshna' || !parsed.creatorName) {
          parsed.creatorName = 'anurag';
          parsed.questions = getDefaultStarterQuiz('anurag');
          saveMyQuiz(parsed);
        }
        return parsed as QuizData;
      }
    }
  } catch (e) {
    console.error('Failed to load my quiz', e);
  }

  // Default starter quiz for Anurag
  const defaultQuiz: QuizData = {
    id: 'anurag_official_quiz',
    creatorName: 'anurag',
    createdAt: Date.now(),
    questions: getDefaultStarterQuiz('anurag'),
    theme: 'pastel-blue',
  };
  saveMyQuiz(defaultQuiz);
  return defaultQuiz;
}

// Save the user's specific personal quiz
export function saveMyQuiz(quiz: QuizData) {
  try {
    localStorage.setItem(MY_QUIZ_STORAGE_KEY, JSON.stringify(quiz));
  } catch (e) {
    console.error('Failed to save my quiz', e);
  }
}

// Save player attempt into the global leaderboard
export function savePlayerAttempt(attempt: PlayerAttempt) {
  try {
    const existing = getGlobalLeaderboard();
    const updated = [attempt, ...existing.filter((a) => a.id !== attempt.id)];
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save attempt', e);
  }
}

// Get all players who played this quiz
export function getGlobalLeaderboard(): PlayerAttempt[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    const list: PlayerAttempt[] = raw ? JSON.parse(raw) : [];
    // Sort by highest score first, then newest
    return list.sort((a, b) => b.score - a.score || b.timestamp - a.timestamp);
  } catch {
    return [];
  }
}

// Clear leaderboard
export function clearGlobalLeaderboard() {
  try {
    localStorage.removeItem(LEADERBOARD_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear leaderboard', e);
  }
}

// Calculate friendship tier info based on percentage
export function calculateTierInfo(percentage: number): TierInfo {
  if (percentage >= 85) {
    return {
      tier: 'soulmate',
      title: 'IMMUNE SOULMATE 👑✨',
      badge: 'Unblockable VIP',
      description: 'You share the exact same brain cell! You know them better than they know themselves.',
      color: '#eab308',
      bgColor: '#fef9c3',
      borderColor: '#fde047',
      mascotReaction: 'celebrate',
    };
  } else if (percentage >= 60) {
    return {
      tier: 'close',
      title: 'CERTIFIED BESTIE 💖',
      badge: 'Safe & Sound',
      description: 'You are completely safe from the block list! Real friend energy right here.',
      color: '#ec4899',
      bgColor: '#fce7f3',
      borderColor: '#f472b6',
      mascotReaction: 'besties',
    };
  } else if (percentage >= 35) {
    return {
      tier: 'restricted',
      title: 'RESTRICTED & ON THIN ICE 👀',
      badge: 'Warning Issued',
      description: 'Muted on Instagram stories! You got some things right, but you are walking a tightrope bestie.',
      color: '#f97316',
      bgColor: '#ffedd5',
      borderColor: '#fb923c',
      mascotReaction: 'suspicious',
    };
  } else {
    return {
      tier: 'blocked',
      title: 'BLOCKED ON SIGHT! 💀',
      badge: 'Banned Bestie',
      description: 'Oof! Straight to the blocked list. Do you even talk or did you meet 5 minutes ago?!',
      color: '#ef4444',
      bgColor: '#fee2e2',
      borderColor: '#f87171',
      mascotReaction: 'blocked',
    };
  }
}
