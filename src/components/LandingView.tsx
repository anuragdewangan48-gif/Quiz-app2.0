import React from 'react';
import { ASSETS } from '../assets/assetMap';
import { sounds } from '../utils/sound';
import { QuizData } from '../types/quiz';
import { Trophy, Edit3, Sparkles, SlidersHorizontal } from 'lucide-react';

interface LandingViewProps {
  quiz: QuizData;
  onStartQuiz: () => void;
  onOpenLeaderboard: () => void;
  onOpenEditQuiz: () => void;
  onOpenDbSettings?: () => void;
  leaderboardCount: number;
  isOwner: boolean;
  onRequestOwnerAccess: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  quiz,
  onStartQuiz,
  onOpenLeaderboard,
  onOpenEditQuiz,
  onOpenDbSettings,
  leaderboardCount,
  isOwner,
  onRequestOwnerAccess,
}) => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between py-2 sm:py-4 px-1">
      {/* Top Section: Mascot with Thought Bubble (matching Image 2) */}
      <div className="w-full max-w-sm flex items-center justify-between relative pt-2 px-3">
        {/* Thought Bubble pointing to the panda */}
        <div className="relative bg-white rounded-3xl p-3.5 shadow-md border-2 border-sky-100 max-w-[170px] z-10 animate-gentle-bounce">
          <p className="font-display text-xs sm:text-sm font-extrabold text-slate-800 leading-snug text-center">
            i will <br />
            find &amp; <span className="text-pink-500">block</span> <br />
            my <span className="underline decoration-amber-300 decoration-wavy decoration-2">fake</span> <br />
            friends
          </p>

          {/* Speech Bubble Tail Dots */}
          <div className="absolute -bottom-2 right-4 w-3 h-3 bg-white rounded-full border border-sky-100 shadow-sm" />
          <div className="absolute -bottom-4 right-1.5 w-2 h-2 bg-white rounded-full border border-sky-100 shadow-sm" />
        </div>

        {/* Cute Mascot sitting on cloud */}
        <div className="relative w-32 h-32 sm:w-36 sm:h-36">
          <img
            src={ASSETS.pandaMascot}
            alt="Panda mascot"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain drop-shadow-lg rounded-full"
          />
          {/* Sparkle badge */}
          <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 absolute -top-1 -left-2 animate-pulse" />
        </div>
      </div>

      {/* Main Sticky Note Notebook Card (matching Image 2) */}
      <div className="w-full max-w-sm relative mt-2 mb-4">
        {/* Pink Washi Tape across top-left */}
        <div className="absolute -top-3.5 left-6 w-32 h-7 washi-tape-pink -rotate-2 z-20 shadow-sm" />

        <div className="w-full bg-notebook-lines rounded-3xl p-6 pt-9 pb-8 shadow-[0_18px_40px_-10px_rgba(2,132,199,0.22)] border-2 border-white relative overflow-visible">
          {/* Binder Ring Holes on the left edge */}
          <div className="absolute left-2.5 top-8 bottom-8 flex flex-col justify-around pointer-events-none z-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-sky-50 border border-slate-300 shadow-inner" />
            ))}
          </div>

          {/* Blocked Phone / Prohibited Badge (matching Image 2) */}
          <div className="absolute top-8 right-4 w-14 h-14 bg-gradient-to-tr from-sky-50 to-pink-50 rounded-2xl border border-sky-100 shadow-md p-1.5 flex items-center justify-center -rotate-6">
            <div className="relative w-full h-full flex items-center justify-center">
              <span className="text-2xl">📱</span>
              {/* Red Prohibition Sign overlay */}
              <div className="absolute inset-0 rounded-full border-4 border-red-500/80 flex items-center justify-center">
                <div className="w-full h-0.5 bg-red-500/80 rotate-45" />
              </div>
            </div>
          </div>

          {/* Main Question Heading */}
          <div className="pl-4 pr-12 text-left">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-sky-500 leading-tight">
              will{' '}
              {isOwner ? (
                <button
                  onClick={() => {
                    sounds.playPop();
                    onOpenEditQuiz();
                  }}
                  className="text-sky-600 underline decoration-sky-300 hover:text-sky-700 transition-colors inline-flex items-center gap-1 group capitalize"
                  title="Edit your name & questions"
                >
                  <span>{quiz.creatorName}</span>
                  <Edit3 className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-600 inline" />
                </button>
              ) : (
                <span className="text-sky-600 capitalize">{quiz.creatorName}</span>
              )}
              <br />
              <span className="text-pink-500">block</span>{' '}
              <span className="text-slate-800">you?</span>
            </h1>

            {/* Wavy Highlight bar under title */}
            <div className="w-36 h-1.5 bg-amber-300 rounded-full my-2" />

            <p className="font-display text-sm sm:text-base font-semibold text-slate-500 mt-2">
              let&apos;s see how well you know{' '}
              <span className="text-sky-600 font-bold capitalize">{quiz.creatorName}</span>
            </p>
          </div>

          {/* Cute Doodle Heart */}
          <div className="absolute bottom-5 right-5 text-sky-400 pointer-events-none">
            <svg className="w-6 h-6 stroke-sky-400 stroke-2 fill-none" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          {/* Blue Flower Sticker (bottom left) */}
          <div className="absolute -bottom-4 -left-3 pointer-events-none z-20">
            <div className="w-10 h-10 rounded-full bg-sky-400 border-2 border-white shadow-md flex items-center justify-center text-amber-200 text-lg font-black">
              ✿
            </div>
          </div>

          {/* Yellow Star Sticker (bottom right) */}
          <div className="absolute -bottom-4 right-8 pointer-events-none z-20 rotate-12">
            <div className="w-9 h-9 rounded-xl bg-amber-300 border-2 border-white shadow-md flex items-center justify-center text-white text-base font-bold">
              ★
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="w-full max-w-sm space-y-2.5 px-1">
        {/* Prominent Tactile Blue 3D Start Quiz Button (matching Image 2) */}
        <button
          onClick={() => {
            sounds.playPop();
            onStartQuiz();
          }}
          className="w-full h-15 rounded-2xl text-white font-display text-xl font-bold flex items-center justify-center gap-3 btn-3d-blue cursor-pointer"
        >
          <span>start quiz</span>
          <span className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center text-base font-black">
            ➔
          </span>
        </button>

        {/* View Friend Leaderboard Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onOpenLeaderboard();
          }}
          className="w-full h-12 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 text-amber-800 font-display text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-amber-600 fill-amber-400" />
          <span>Friend Leaderboard</span>
          {leaderboardCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-black">
              {leaderboardCount} played
            </span>
          )}
        </button>

        {/* Edit Questions & Options (ONLY visible to Anurag/Owner!) */}
        {isOwner ? (
          <div className="space-y-1.5 w-full">
            <button
              onClick={() => {
                sounds.playPop();
                onOpenEditQuiz();
              }}
              className="w-full h-11 rounded-2xl bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 font-display text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-500" />
              <span>Edit Questions, Options &amp; Real Answers</span>
            </button>

            {onOpenDbSettings && (
              <div className="text-center pt-1">
                <button
                  onClick={() => {
                    sounds.playPop();
                    onOpenDbSettings();
                  }}
                  className="text-[11px] font-bold text-sky-600 hover:text-sky-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>⚡ Live Sync &amp; Database Settings</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="pt-2 flex items-center justify-center gap-3 text-center">
            <button
              onClick={() => {
                sounds.playPop();
                onRequestOwnerAccess();
              }}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              🔒 Owner Settings (Anurag only)
            </button>

            {onOpenDbSettings && (
              <>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => {
                    sounds.playPop();
                    onOpenDbSettings();
                  }}
                  className="text-[11px] font-bold text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                >
                  ⚡ Live Sync
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
