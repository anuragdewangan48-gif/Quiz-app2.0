import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizData, PlayerAttempt } from '../types/quiz';
import { calculateTierInfo, getGlobalLeaderboard } from '../utils/share';
import { ASSETS } from '../assets/assetMap';
import { sounds } from '../utils/sound';
import { MessageCircle, RotateCcw, Trophy, Home } from 'lucide-react';

interface ResultsViewProps {
  quiz: QuizData;
  attempt: PlayerAttempt;
  onPlayAgain: () => void;
  onHome: () => void;
  onOpenLeaderboard: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  quiz,
  attempt,
  onPlayAgain,
  onHome,
  onOpenLeaderboard,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [leaderboard, setLeaderboard] = useState<PlayerAttempt[]>([]);

  const tier = calculateTierInfo(attempt.percentage);

  useEffect(() => {
    // Sound effect based on score
    if (attempt.percentage >= 60) {
      sounds.playFanfare();
      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#f472b6', '#fde047', '#a855f7'],
        });
      } catch {}
    } else {
      sounds.playBonk();
    }

    // Load leaderboard
    setLeaderboard(getGlobalLeaderboard());
  }, [attempt]);

  const handleWhatsAppShare = () => {
    sounds.playPop();
    const text = `I just took ${quiz.creatorName}'s friendship quiz! My score: ${attempt.score}/${attempt.total} (${tier.title})! Will ${quiz.creatorName} block you?`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Choose Mascot image according to result
  const mascotImg =
    tier.mascotReaction === 'celebrate'
      ? ASSETS.pandaCrown
      : tier.mascotReaction === 'besties'
      ? ASSETS.pandaBearBesties
      : tier.mascotReaction === 'suspicious'
      ? ASSETS.pandaSuspicious
      : ASSETS.pandaSuspicious;

  return (
    <div className="w-full flex-1 flex flex-col items-center py-2 sm:py-4 px-1 max-w-sm mx-auto">
      {/* Top Floating Mascot */}
      <div className="w-28 h-28 -mb-6 relative z-10 animate-gentle-bounce">
        <img
          src={mascotImg}
          alt={tier.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-full drop-shadow-xl"
        />
      </div>

      {/* Main Result Sticky Note */}
      <div className="w-full relative bg-notebook-lines rounded-3xl p-6 pt-9 pb-6 shadow-[0_18px_40px_-10px_rgba(2,132,199,0.22)] border-2 border-white mb-4">
        {/* Pink Washi Tape across top-center */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 washi-tape-pink shadow-sm -rotate-1" />

        {/* Header verdict badge */}
        <div className="text-center mb-3">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-2 border shadow-xs"
            style={{
              backgroundColor: tier.bgColor,
              borderColor: tier.borderColor,
              color: tier.color,
            }}
          >
            {tier.badge}
          </div>

          <h2 className="font-display text-2xl font-black text-slate-800 leading-tight">
            {tier.title}
          </h2>
        </div>

        {/* Score Circle */}
        <div className="flex flex-col items-center justify-center my-3 py-2 bg-sky-50/70 rounded-2xl border border-sky-100">
          <div className="text-4xl font-display font-black text-sky-600">
            {attempt.score} <span className="text-xl font-bold text-slate-400">/ {attempt.total}</span>
          </div>
          <div className="text-xs font-extrabold text-pink-500 uppercase tracking-widest mt-0.5">
            {attempt.percentage}% Compatibility with <span className="capitalize">{quiz.creatorName}</span>
          </div>
        </div>

        {/* Description Text */}
        <p className="font-semibold text-xs sm:text-sm text-slate-600 text-center leading-relaxed px-2 mb-3">
          {tier.description}
        </p>

        {/* Bonus note summary if provided */}
        {(attempt.bonusThoughts || (attempt.bonusTags && attempt.bonusTags.length > 0)) && (
          <div className="mb-3 p-2.5 bg-pink-50/70 rounded-xl border border-pink-200 text-left">
            <span className="text-[10px] font-black text-pink-600 uppercase tracking-wide block mb-0.5">
              💌 Your Note for {quiz.creatorName}:
            </span>
            {attempt.bonusThoughts && (
              <p className="text-xs italic text-slate-700 font-medium">
                &ldquo;{attempt.bonusThoughts}&rdquo;
              </p>
            )}
            {attempt.bonusTags && attempt.bonusTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {attempt.bonusTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white text-slate-600 border border-pink-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Toggle Question Breakdown */}
        <button
          onClick={() => {
            sounds.playPop();
            setShowBreakdown(!showBreakdown);
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-sky-50 text-sky-600 border border-sky-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>{showBreakdown ? 'Hide answers breakdown ▲' : 'See all answers breakdown ▼'}</span>
        </button>

        {/* Question by Question Breakdown Details */}
        {showBreakdown && (
          <div className="mt-4 pt-3 border-t border-slate-200 space-y-3 max-h-64 overflow-y-auto pr-1">
            {quiz.questions.map((q, idx) => {
              const playerAnswerId = attempt.answers[q.id];
              const isCorrect = playerAnswerId === q.correctAnswerId;
              const playerOption = q.options.find((o) => o.id === playerAnswerId);
              const correctOption = q.options.find((o) => o.id === q.correctAnswerId);

              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-xl text-left border ${
                    isCorrect ? 'bg-emerald-50/80 border-emerald-200' : 'bg-rose-50/80 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-700">
                      {idx + 1}. {q.question}
                    </span>
                    <span className="text-sm shrink-0">{isCorrect ? '✅' : '❌'}</span>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div>
                      <span className="font-bold">Your answer: </span>
                      <span>{playerOption ? playerOption.text : 'Skipped'}</span>
                    </div>
                    {!isCorrect && (
                      <div className="text-emerald-700 font-semibold">
                        <span>{quiz.creatorName}&apos;s real answer: </span>
                        <span>{correctOption?.text}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2 mb-4 px-1">
        {/* View Friend Leaderboard Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onOpenLeaderboard();
          }}
          className="w-full h-12 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-display text-base font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_#d97706] active:translate-y-1 active:shadow-[0_1px_0_#d97706] cursor-pointer transition-all"
        >
          <Trophy className="w-5 h-5 fill-amber-950" />
          <span>View Friend Leaderboard</span>
        </button>

        {/* WhatsApp Share Button */}
        <button
          onClick={handleWhatsAppShare}
          className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-display text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_0_#059669] active:translate-y-1 cursor-pointer transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Tell {quiz.creatorName} on WhatsApp</span>
        </button>

        {/* Retake & Home buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              sounds.playPop();
              onPlayAgain();
            }}
            className="h-11 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onHome();
            }}
            className="h-11 rounded-2xl btn-3d-blue text-white font-display text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Preview (Top friends who took the quiz) */}
      {leaderboard.length > 0 && (
        <div className="w-full bg-white/95 backdrop-blur-xs rounded-2xl p-4 border border-amber-200/80 shadow-sm mb-4">
          <div className="flex items-center justify-between font-display text-xs font-bold text-slate-800 mb-2.5">
            <span className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Top Friends of {quiz.creatorName}</span>
            </span>
            <button
              onClick={onOpenLeaderboard}
              className="text-[11px] font-bold text-sky-600 hover:underline"
            >
              See all ({leaderboard.length}) ➔
            </button>
          </div>

          <div className="space-y-1.5">
            {leaderboard.slice(0, 4).map((att, idx) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div
                  key={att.id}
                  className={`flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl font-medium ${
                    att.id === attempt.id ? 'bg-amber-100/90 border border-amber-300 font-bold' : 'bg-sky-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-center">{medals[idx] || `#${idx + 1}`}</span>
                    <span className="font-bold text-slate-800">
                      {att.playerName} {att.id === attempt.id && '(You)'}
                    </span>
                  </div>
                  <span className="font-bold text-pink-600">
                    {att.score}/{att.total} ({att.percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
