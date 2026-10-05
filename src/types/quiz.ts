export interface QuizOption {
  id: string;
  text: string;
  emoji?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswerId: string;
  explanation?: string;
}

export interface QuizData {
  id: string;
  creatorName: string;
  createdAt: number;
  questions: QuizQuestion[];
  theme?: 'pastel-blue' | 'pastel-pink' | 'pastel-yellow';
}

export interface PlayerAttempt {
  id: string;
  playerName: string;
  score: number;
  total: number;
  percentage: number;
  answers: Record<string, string>; // questionId -> chosenOptionId
  bonusThoughts?: string;
  bonusTags?: string[];
  timestamp: number;
}

export type FriendshipTier = 'soulmate' | 'close' | 'restricted' | 'blocked';

export interface TierInfo {
  tier: FriendshipTier;
  title: string;
  badge: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  mascotReaction: 'celebrate' | 'besties' | 'suspicious' | 'blocked';
}

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'id' | 'ja';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}
