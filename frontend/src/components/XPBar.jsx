import React from 'react';

export default function XPBar({ currentXP, goalXP = 1000, boostText }) {
  const progress = Math.min(100, Math.round((currentXP / goalXP) * 100));
  return (
    <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm text-slate-400">Level progress</p>
          <p className="text-lg font-semibold">{currentXP} / {goalXP} XP</p>
        </div>
        {boostText && <span className="text-xs text-emerald-300">{boostText}</span>}
      </div>
      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-3 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
