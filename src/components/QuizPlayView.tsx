import React, { useState } from 'react';
import { QuizData, QuizOption } from '../types/quiz';
import { ASSETS } from '../assets/assetMap';
import { sounds } from '../utils/sound';

interface QuizPlayViewProps {
  quiz: QuizData;
  playerName: string;
  onFinishQuiz: (answers: Record<string, string>) => void;
}

export const QuizPlayView: React.FC<QuizPlayViewProps> = ({
  quiz,
  playerName,
  onFinishQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentIndex];

  const handleSelectOption = (option: QuizOption) => {
    sounds.playPop();
    setSelectedOptionId(option.id);
  };

  const handleNext = () => {
    if (!selectedOptionId) return;

    sounds.playPop();
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: selectedOptionId,
    };
    setAnswers(newAnswers);
    setSelectedOptionId(null);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinishQuiz(newAnswers);
    }
  };

  // Progress percentage
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between py-2 sm:py-4 px-1">
      {/* Top Progress & Mascot Bar */}
      <div className="w-full max-w-sm mb-3">
        <div className="flex items-center justify-between px-2 mb-1.5">
          <span className="font-display text-xs font-bold text-sky-700 bg-white/70 px-3 py-1 rounded-full border border-sky-200">
            For: <span className="text-pink-500 font-extrabold capitalize">{quiz.creatorName}</span>
          </span>
          <span className="font-display text-xs font-bold text-slate-500 bg-white/70 px-3 py-1 rounded-full border border-sky-200">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Cute Progress Bar with moving heart */}
        <div className="w-full h-3.5 bg-white rounded-full p-0.5 border border-sky-200 relative overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-pink-400 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card (Lined Sticky Note) */}
      <div className="w-full max-w-sm relative my-auto">
        {/* Pink Washi Tape */}
        <div className="absolute -top-3.5 left-8 w-28 h-6 washi-tape-pink -rotate-2 z-20 shadow-sm" />

        {/* Mascot Peeking from top-right */}
        <div className="absolute -top-10 -right-2 w-16 h-16 z-10 pointer-events-none animate-gentle-bounce">
          <img
            src={ASSETS.pandaMascot}
            alt="Mascot"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain rounded-full drop-shadow-md"
          />
        </div>

        <div className="w-full bg-notebook-lines rounded-3xl p-5 pt-8 pb-6 shadow-[0_15px_35px_-8px_rgba(2,132,199,0.2)] border-2 border-white relative">
          {/* Binder Holes */}
          <div className="absolute left-2.5 top-6 bottom-6 flex flex-col justify-around pointer-events-none">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-sky-50 border border-slate-300" />
            ))}
          </div>

          {/* Question Text */}
          <div className="pl-4 pr-3 mb-5">
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-800 leading-snug">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="pl-3 space-y-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOptionId === opt.id;
              const optionLetters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full p-3.5 rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-pink-500 text-white shadow-[0_4px_0_#be185d] scale-[1.02]'
                      : 'bg-white hover:bg-sky-50/80 text-slate-800 border-2 border-sky-100 hover:border-sky-300 shadow-sm active:scale-[0.98]'
                  }`}
                >
                  {/* Badge Letter */}
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-display text-xs font-black shrink-0 ${
                      isSelected
                        ? 'bg-white text-pink-600'
                        : 'bg-sky-100 text-sky-700'
                    }`}
                  >
                    {optionLetters[idx]}
                  </span>

                  {/* Emoji if available */}
                  {opt.emoji && <span className="text-xl shrink-0">{opt.emoji}</span>}

                  {/* Text */}
                  <span className="font-semibold text-sm sm:text-base leading-snug flex-1">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="w-full max-w-sm mt-4 px-1">
        <button
          onClick={handleNext}
          disabled={!selectedOptionId}
          className={`w-full h-14 rounded-2xl font-display text-lg font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            selectedOptionId
              ? 'btn-3d-blue active:translate-y-1'
              : 'bg-slate-300 text-white shadow-none cursor-not-allowed opacity-60'
          }`}
        >
          <span>{currentIndex === totalQuestions - 1 ? 'bonus question ➔' : 'next question ➔'}</span>
        </button>

        <p className="text-center text-xs font-bold text-sky-600/80 mt-2">
          Playing as <span className="text-pink-600 font-extrabold">{playerName}</span>
        </p>
      </div>
    </div>
  );
};
