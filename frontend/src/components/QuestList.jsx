import React from 'react';

export default function QuestList({ quests }) {
  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Daily Quests</h3>
        <span className="text-xs text-emerald-300">Gems + XP rewards</span>
      </div>
      {quests.map((q) => {
        const percent = Math.min(100, Math.round((q.progress / q.quest.target) * 100));
        return (
          <div key={q.id} className="bg-slate-900/60 border border-slate-700 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{q.quest.title}</p>
                <p className="text-xs text-slate-400">{q.quest.description}</p>
              </div>
              {q.completed ? (
                <span className="text-emerald-300 text-sm font-semibold">Claimed</span>
              ) : (
                <span className="text-xs text-amber-200">{q.progress}/{q.quest.target}</span>
              )}
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                style={{ width: `${percent}%` }}
                className={`h-full ${q.completed ? 'bg-emerald-400' : 'bg-amber-400'} transition-all`}
              />
            </div>
            <p className="text-xs text-slate-400">Rewards: {q.quest.rewardGems} gems • {q.quest.rewardXp} XP</p>
          </div>
        );
      })}
      {quests.length === 0 && <p className="text-sm text-slate-400">No quests yet. Complete a lesson to unlock.</p>}
    </div>
  );
}
