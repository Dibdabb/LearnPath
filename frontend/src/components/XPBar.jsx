import React from 'react';

export default function XPBar({ currentXP, goalXP = 1000 }) {
  const progress = Math.min(100, Math.round((currentXP / goalXP) * 100));
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-slate-400">Level progress</p>
          <p className="text-lg font-semibold">{currentXP} / {goalXP} XP</p>
        </div>
        <span className="text-sm text-emerald-400">+10 XP Boost active</span>
      </div>
      <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden">
        <div
          className="h-3 bg-gradient-to-r from-primary to-secondary"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
