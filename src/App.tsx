/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { QuizData, PlayerAttempt, SupportedLanguage } from './types/quiz';
import {
  getMyQuiz,
  checkIsOwner,
  setOwnerAuth,
} from './utils/share';
import {
  fetchLeaderboard,
  submitQuizResult,
  fetchQuizConfig,
  saveQuizConfigServer,
  resetLeaderboardServer,
  subscribeToLiveLeaderboard,
} from './services/api';
import { sounds } from './utils/sound';
import { DoodleBackground } from './components/DoodleBackground';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { NameEntryView } from './components/NameEntryView';
import { QuizPlayView } from './components/QuizPlayView';
import { BonusQuestionView } from './components/BonusQuestionView';
import { ResultsView } from './components/ResultsView';
import { LoadingScreen } from './components/LoadingScreen';
import { LeaderboardModal } from './components/LeaderboardModal';
import { EditQuizModal } from './components/EditQuizModal';
import { OwnerAuthModal } from './components/OwnerAuthModal';
import { DatabaseSettingsModal } from './components/DatabaseSettingsModal';

type AppScreen =
  | 'loading'
  | 'landing'
  | 'name_entry_player'
  | 'playing'
  | 'bonus'
  | 'results';

export default function App() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [screen, setScreen] = useState<AppScreen>('loading');
  const [loadingMessage, setLoadingMessage] = useState('loading...');

  // User's specific personal quiz (always Anurag)
  const [myQuiz, setMyQuiz] = useState<QuizData>(() => getMyQuiz());

  // Current friend playing
  const [playerName, setPlayerName] = useState<string>('');
  const [temporaryAnswers, setTemporaryAnswers] = useState<Record<string, string>>({});
  const [latestAttempt, setLatestAttempt] = useState<PlayerAttempt | null>(null);

  // Global leaderboard of friends who tested
  const [leaderboard, setLeaderboard] = useState<PlayerAttempt[]>([]);

  // Owner mode state (only Anurag can edit)
  const [isOwner, setIsOwner] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('owner') === 'anurag' || params.get('admin') === 'anurag') {
        setOwnerAuth(true);
        return true;
      }
    }
    return checkIsOwner();
  });

  // Modals
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOwnerAuthOpen, setIsOwnerAuthOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // Initial sync & Real-Time Live Subscription
  useEffect(() => {
    // 1. Load active quiz configuration
    fetchQuizConfig().then((latestQuiz) => {
      if (latestQuiz) setMyQuiz(latestQuiz);
    });

    // 2. Subscribe to live leaderboard updates
    // (Uses Firebase onSnapshot real-time listener if configured, or smart polling for Vercel Serverless)
    const unsubscribe = subscribeToLiveLeaderboard((attempts) => {
      if (attempts) {
        setLeaderboard(attempts);
      }
    }, 4500);

    const timer = setTimeout(() => {
      setScreen('landing');
    }, 600);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  // Handlers
  const handleStartQuiz = () => {
    sounds.playPop();
    setScreen('name_entry_player');
  };

  const handlePlayerNameEntered = (name: string) => {
    sounds.playPop();
    setPlayerName(name);
    setLoadingMessage('getting quiz ready...');
    setScreen('loading');
    setTimeout(() => {
      setScreen('playing');
    }, 450);
  };

  // Called when all standard quiz questions are answered
  const handleQuestionsCompleted = (answers: Record<string, string>) => {
    setTemporaryAnswers(answers);
    sounds.playPop();
    // Transition to the bonus question!
    setScreen('bonus');
  };

  // Finalize attempt (with or without bonus) and save to backend / Firebase
  const handleFinalizeAttempt = async (bonusThoughts?: string, bonusTags?: string[]) => {
    let score = 0;
    myQuiz.questions.forEach((q) => {
      if (temporaryAnswers[q.id] === q.correctAnswerId) {
        score += 1;
      }
    });

    const total = myQuiz.questions.length;
    const percentage = Math.round((score / total) * 100);

    setLoadingMessage(`calculating ${myQuiz.creatorName}'s verdict...`);
    setScreen('loading');

    try {
      // Save result securely to Firestore / Vercel API & local cache
      const saved = await submitQuizResult({
        playerName: playerName || 'Anonymous Bestie',
        score,
        total,
        percentage,
        answers: temporaryAnswers,
        bonusThoughts: bonusThoughts || undefined,
        bonusTags: bonusTags && bonusTags.length > 0 ? bonusTags : undefined,
      });

      setLatestAttempt(saved);
      // Refresh leaderboard list
      const updatedList = await fetchLeaderboard();
      setLeaderboard(updatedList);
    } catch (err) {
      console.error('Failed to submit result:', err);
    } finally {
      setTimeout(() => {
        setScreen('results');
      }, 500);
    }
  };

  const handleSaveQuizEdits = async (updatedQuiz: QuizData) => {
    setMyQuiz(updatedQuiz);
    await saveQuizConfigServer(updatedQuiz);
  };

  const handleClearLeaderboard = async () => {
    await resetLeaderboardServer();
    setLeaderboard([]);
  };

  const handleManualRefreshLeaderboard = async () => {
    const updated = await fetchLeaderboard();
    setLeaderboard(updated);
  };

  const handleOwnerUnlocked = () => {
    setIsOwner(true);
    setIsOwnerAuthOpen(false);
    setIsEditModalOpen(true);
  };

  return (
    <DoodleBackground>
      {/* Top Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onHomeClick={() => setScreen('landing')}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        leaderboardCount={leaderboard.length}
      />

      {/* Main Screen Router */}
      <main className="w-full flex-1 flex flex-col justify-center">
        {screen === 'loading' && <LoadingScreen message={loadingMessage} />}

        {screen === 'landing' && (
          <LandingView
            quiz={myQuiz}
            onStartQuiz={handleStartQuiz}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenEditQuiz={() => setIsEditModalOpen(true)}
            onOpenDbSettings={() => setIsDbModalOpen(true)}
            leaderboardCount={leaderboard.length}
            isOwner={isOwner}
            onRequestOwnerAccess={() => setIsOwnerAuthOpen(true)}
          />
        )}

        {screen === 'name_entry_player' && (
          <NameEntryView
            onContinue={handlePlayerNameEntered}
            titlePrompt="what's your"
            subtitle="name?"
            initialValue={playerName}
          />
        )}

        {screen === 'playing' && (
          <QuizPlayView
            quiz={myQuiz}
            playerName={playerName}
            onFinishQuiz={handleQuestionsCompleted}
          />
        )}

        {screen === 'bonus' && (
          <BonusQuestionView
            creatorName={myQuiz.creatorName}
            playerName={playerName}
            onSubmitBonus={(thoughts, tags) => handleFinalizeAttempt(thoughts, tags)}
            onSkip={() => handleFinalizeAttempt()}
          />
        )}

        {screen === 'results' && latestAttempt && (
          <ResultsView
            quiz={myQuiz}
            attempt={latestAttempt}
            onPlayAgain={() => setScreen('playing')}
            onHome={() => setScreen('landing')}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        )}
      </main>

      {/* Leaderboard Modal */}
      {isLeaderboardOpen && (
        <LeaderboardModal
          creatorName={myQuiz.creatorName}
          leaderboard={leaderboard}
          onClearLeaderboard={handleClearLeaderboard}
          onRefreshLeaderboard={handleManualRefreshLeaderboard}
          onClose={() => setIsLeaderboardOpen(false)}
        />
      )}

      {/* Edit Quiz & Questions Modal (Anurag only) */}
      {isEditModalOpen && isOwner && (
        <EditQuizModal
          quiz={myQuiz}
          onSave={handleSaveQuizEdits}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Owner Auth Modal for passcode entry */}
      {isOwnerAuthOpen && (
        <OwnerAuthModal
          onSuccess={handleOwnerUnlocked}
          onClose={() => setIsOwnerAuthOpen(false)}
        />
      )}

      {/* Database & Real-Time Sync Modal */}
      {isDbModalOpen && (
        <DatabaseSettingsModal
          onClose={() => setIsDbModalOpen(false)}
          onConfigChanged={() => {
            fetchLeaderboard().then((data) => setLeaderboard(data));
          }}
        />
      )}
    </DoodleBackground>
  );
}
