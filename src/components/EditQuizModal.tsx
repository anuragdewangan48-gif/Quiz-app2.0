import React, { useState } from 'react';
import { QuizData, QuizQuestion, QuizOption } from '../types/quiz';
import { QUESTION_BANK } from '../data/defaultQuestions';
import { sounds } from '../utils/sound';
import { X, Check, Plus, Trash2, Edit2, Sparkles, AlertCircle } from 'lucide-react';

interface EditQuizModalProps {
  quiz: QuizData;
  onSave: (updatedQuiz: QuizData) => void;
  onClose: () => void;
}

export const EditQuizModal: React.FC<EditQuizModalProps> = ({
  quiz,
  onSave,
  onClose,
}) => {
  const [creatorName, setCreatorName] = useState(quiz.creatorName);
  const [questions, setQuestions] = useState<QuizQuestion[]>(quiz.questions);
  const [activeTab, setActiveTab] = useState<'name' | 'questions'>('questions');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    quiz.questions[0]?.id || null
  );

  // Update question text
  const handleUpdateQuestionText = (qId: string, newText: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, question: newText } : q))
    );
  };

  // Update option text or emoji
  const handleUpdateOption = (
    qId: string,
    optId: string,
    field: 'text' | 'emoji',
    val: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const newOptions = q.options.map((opt) =>
          opt.id === optId ? { ...opt, [field]: val } : opt
        );
        return { ...q, options: newOptions };
      })
    );
  };

  // Set correct answer
  const handleSetCorrectAnswer = (qId: string, optId: string) => {
    sounds.playPop();
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, correctAnswerId: optId } : q))
    );
  };

  // Delete question
  const handleDeleteQuestion = (qId: string) => {
    if (questions.length <= 1) {
      alert('You must have at least 1 question in your quiz!');
      return;
    }
    sounds.playBonk();
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
  };

  // Add a blank question
  const handleAddCustomQuestion = () => {
    sounds.playPop();
    const newId = `q_custom_${Date.now()}`;
    const newQuestion: QuizQuestion = {
      id: newId,
      question: `What would ${creatorName} do if...`,
      options: [
        { id: 'opt_1', text: 'Spam funny memes', emoji: '🤣' },
        { id: 'opt_2', text: 'Block without warning', emoji: '🚫' },
        { id: 'opt_3', text: 'Pretend nothing happened', emoji: '😇' },
        { id: 'opt_4', text: 'Overthink for days', emoji: '🥺' },
      ],
      correctAnswerId: 'opt_1',
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setExpandedQuestionId(newId);
  };

  // Add from pre-made bank
  const handleAddFromBank = (bankItem: typeof QUESTION_BANK[0]) => {
    sounds.playPop();
    const newId = `q_bank_${Date.now()}`;
    const formattedQuestion = bankItem.question.replace(/me|I|my/gi, (m) => {
      if (m.toLowerCase() === 'my') return `${creatorName}'s`;
      if (m.toLowerCase() === 'me') return creatorName;
      return creatorName;
    });

    const newQuestion: QuizQuestion = {
      id: newId,
      question: formattedQuestion,
      options: bankItem.options,
      correctAnswerId: bankItem.options[0].id,
      explanation: bankItem.explanation,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setExpandedQuestionId(newId);
  };

  // Save all changes
  const handleSaveAll = () => {
    const trimmedName = creatorName.trim() || 'My Bestie';
    sounds.playFanfare();
    onSave({
      ...quiz,
      creatorName: trimmedName,
      questions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border-2 border-sky-200 max-h-[92vh] flex flex-col relative overflow-hidden">
        {/* Pink Washi Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-5 washi-tape-pink shadow-xs -rotate-1 pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 pt-1 border-b border-sky-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-600 shadow-xs">
              <Edit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-slate-800 text-lg leading-tight">
                Edit My Quiz
              </h3>
              <p className="text-[11px] font-bold text-slate-400">
                Customize your name, questions, &amp; real answers
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Name Input Bar */}
        <div className="py-2.5 px-1 bg-sky-50/80 rounded-2xl border border-sky-200 mt-2 mb-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-black uppercase text-sky-800 tracking-wider">
              Your Name (Quiz Subject)
            </label>
            <span className="text-[10px] font-bold text-slate-400">
              {creatorName.length}/15
            </span>
          </div>
          <input
            type="text"
            value={creatorName}
            maxLength={15}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="Type your name..."
            className="w-full h-9 px-3 bg-white font-display font-bold text-slate-800 rounded-xl border border-sky-200 text-sm focus:outline-none focus:border-sky-400"
          />
        </div>

        {/* Section Heading & Add Question Buttons */}
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="font-display text-xs font-black text-slate-700">
            Questions ({questions.length})
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddCustomQuestion}
              className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 font-display text-[11px] font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* Scrollable Questions Editor */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
          {questions.map((q, qIndex) => {
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border-2 border-sky-100 shadow-xs overflow-hidden"
              >
                {/* Collapsed Header Bar */}
                <div
                  onClick={() => {
                    sounds.playPop();
                    setExpandedQuestionId(isExpanded ? null : q.id);
                  }}
                  className="p-3 bg-slate-50/80 hover:bg-sky-50/50 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 pr-2 overflow-hidden">
                    <span className="w-5 h-5 rounded-md bg-pink-100 text-pink-600 font-display font-bold text-[10px] flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>
                    <span className="font-display font-bold text-slate-800 text-xs truncate">
                      {q.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {questions.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(q.id);
                        }}
                        className="p-1 text-slate-300 hover:text-rose-500 rounded transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <span className="text-slate-400 text-xs font-bold">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expanded Question Form */}
                {isExpanded && (
                  <div className="p-3 space-y-2.5 border-t border-sky-100 bg-white">
                    {/* Question Input */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                        Question Text
                      </label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleUpdateQuestionText(q.id, e.target.value)}
                        className="w-full h-8 px-2.5 bg-sky-50/50 font-display font-bold text-slate-800 text-xs rounded-lg border border-sky-200 focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    {/* Options Editor */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          Options (Tap ✓ for your real answer)
                        </label>
                      </div>

                      <div className="space-y-1.5">
                        {q.options.map((opt, optIndex) => {
                          const isCorrect = q.correctAnswerId === opt.id;
                          const letter = ['A', 'B', 'C', 'D'][optIndex];

                          return (
                            <div
                              key={opt.id}
                              className={`flex items-center gap-1.5 p-1.5 rounded-xl border transition-all ${
                                isCorrect
                                  ? 'bg-emerald-50/90 border-emerald-300 shadow-2xs'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              {/* Option Letter */}
                              <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 font-display font-bold text-[10px] flex items-center justify-center shrink-0">
                                {letter}
                              </span>

                              {/* Emoji input */}
                              <input
                                type="text"
                                value={opt.emoji || ''}
                                maxLength={2}
                                onChange={(e) =>
                                  handleUpdateOption(q.id, opt.id, 'emoji', e.target.value)
                                }
                                className="w-8 h-7 text-center bg-sky-50/60 rounded-md border border-sky-200 text-xs"
                                title="Option Emoji"
                              />

                              {/* Text input */}
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) =>
                                  handleUpdateOption(q.id, opt.id, 'text', e.target.value)
                                }
                                className="flex-1 h-7 px-2 bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
                              />

                              {/* Correct Answer Checkbox button */}
                              <button
                                type="button"
                                onClick={() => handleSetCorrectAnswer(q.id, opt.id)}
                                title={isCorrect ? 'Correct answer' : 'Set as correct answer'}
                                className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all ${
                                  isCorrect
                                    ? 'bg-emerald-500 text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-700'
                                }`}
                              >
                                {isCorrect ? '✓ Correct' : 'Set'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick Bank Inspiration */}
          <div className="pt-2 border-t border-sky-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">
              Add Ideas from Question Bank:
            </span>
            <div className="flex flex-wrap gap-1">
              {QUESTION_BANK.slice(0, 4).map((bankItem) => (
                <button
                  key={bankItem.id}
                  onClick={() => handleAddFromBank(bankItem)}
                  className="px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-slate-700 font-semibold text-[10px] border border-sky-200 flex items-center gap-1"
                >
                  <Plus className="w-2.5 h-2.5 text-sky-500" />
                  <span className="truncate max-w-[170px]">{bankItem.question.slice(0, 24)}...</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer: Save & Cancel Buttons */}
        <div className="pt-3 mt-2 border-t border-sky-100 flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="flex-1 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-display text-xs font-bold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveAll}
            className="flex-1 h-11 rounded-2xl btn-3d-blue text-white font-display text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Save Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
};
