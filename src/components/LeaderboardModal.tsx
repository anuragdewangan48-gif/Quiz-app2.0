import React, { useState } from 'react';
import { PlayerAttempt } from '../types/quiz';
import { calculateTierInfo } from '../utils/share';
import { sounds } from '../utils/sound';
import { Trophy, X, Search, Trash2, Heart, MessageSquare } from 'lucide-react';

interface LeaderboardModalProps {
  creatorName: string;
  leaderboard: PlayerAttempt[];
  onClearLeaderboard: () => void;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  creatorName,
  leaderboard,
  onClearLeaderboard,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = leaderboard.filter((item) =>
    item.playerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClear = () => {
    sounds.playBonk();
    onClearLeaderboard();
    setConfirmClear(false);
  };

  const formatTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border-2 border-sky-200 max-h-[88vh] flex flex-col relative overflow-hidden">
        {/* Pink Washi Tape decoration at top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-5 washi-tape-pink shadow-xs -rotate-1 pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 pt-1 border-b border-sky-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-500 shadow-xs">
              <Trophy className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-display font-black text-slate-800 text-lg leading-tight">
                Friend Leaderboard
              </h3>
              <p className="text-[11px] font-bold text-sky-600">
                Who knows <span className="text-pink-500 capitalize">{creatorName}</span> best?
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar & Total Counter */}
        <div className="py-2.5">
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search friends..."
              className="w-full h-8 pl-8 pr-3 bg-sky-50/70 border border-sky-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold px-1 text-slate-500">
            <span>
              {leaderboard.length} {leaderboard.length === 1 ? 'Friend' : 'Friends'} Tested
            </span>
            {leaderboard.length > 0 && !confirmClear && (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            {confirmClear && (
              <div className="flex items-center gap-1.5 text-rose-600">
                <span>Clear all?</span>
                <button
                  onClick={handleClear}
                  className="px-1.5 py-0.5 bg-rose-500 text-white rounded font-bold hover:bg-rose-600"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-bold"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Players List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[160px]">
          {filtered.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-center px-4">
              <span className="text-3xl mb-2">🤫</span>
              <p className="font-display font-bold text-slate-600 text-sm">
                {searchTerm ? 'No friends found matching search' : 'No friends have played yet!'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Share your quiz link with friends to see who really knows you!
              </p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const tier = calculateTierInfo(item.percentage);
              const rank = index + 1;
              const isTop3 = rank <= 3;
              const rankBadges = ['🥇', '🥈', '🥉'];
              const isExpanded = expandedId === item.id;
              const hasBonus = (item.bonusThoughts && item.bonusThoughts.trim().length > 0) || (item.bonusTags && item.bonusTags.length > 0);

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isTop3
                      ? 'bg-gradient-to-r from-amber-50/70 to-sky-50/70 border-amber-200/80 shadow-xs'
                      : 'bg-white border-slate-100 hover:border-sky-200'
                  }`}
                >
                  {/* Row Header */}
                  <div
                    onClick={() => {
                      sounds.playPop();
                      setExpandedId(isExpanded ? null : item.id);
                    }}
                    className="p-3 flex items-center justify-between cursor-pointer"
                  >
                    {/* Left: Rank & Player info */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 text-center font-display font-black text-sm text-slate-700 shrink-0">
                        {rankBadges[index] || `#${rank}`}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-extrabold text-slate-800 text-sm">
                            {item.playerName}
                          </span>
                          {hasBonus && (
                            <span className="px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-600 text-[9px] font-black inline-flex items-center gap-0.5">
                              <Heart className="w-2.5 h-2.5 fill-current" />
                              <span>Thought</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className="text-[10px] font-black px-1.5 py-0.5 rounded-md"
                            style={{
                              backgroundColor: tier.bgColor,
                              color: tier.color,
                            }}
                          >
                            {tier.badge}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Score */}
                    <div className="text-right shrink-0">
                      <div className="font-display font-black text-sm text-sky-600">
                        {item.score}/{item.total}
                      </div>
                      <div className="text-[10px] font-extrabold text-pink-500">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Expanded Bonus Thoughts section */}
                  {isExpanded && (
                    <div className="p-3 bg-pink-50/50 border-t border-sky-100 text-xs">
                      {/* Bonus Tags */}
                      {item.bonusTags && item.bonusTags.length > 0 && (
                        <div className="mb-2">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                            Vibes chosen for {creatorName}:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {item.bonusTags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md bg-white text-slate-700 border border-pink-200 text-[11px] font-bold shadow-2xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Personal Note */}
                      {item.bonusThoughts && item.bonusThoughts.trim().length > 0 ? (
                        <div className="p-2.5 bg-white rounded-xl border border-pink-200 shadow-2xs">
                          <span className="text-[10px] font-black text-pink-500 uppercase tracking-wide flex items-center gap-1 mb-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>Secret Message from {item.playerName}:</span>
                          </span>
                          <p className="text-xs font-semibold text-slate-700 italic">
                            &ldquo;{item.bonusThoughts}&rdquo;
                          </p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">
                          No written message left by {item.playerName}.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Close Button */}
        <div className="pt-3 mt-2 border-t border-sky-100">
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-full h-11 rounded-2xl btn-3d-blue text-white font-display text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
