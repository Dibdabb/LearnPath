import React from 'react';

export default function Header({ user }) {
  return (
    <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-slate-800 px-4 py-3 rounded-xl shadow-lg border border-slate-700">
      <div>
        <p className="text-xs uppercase text-slate-400">Welcome back</p>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-sm text-slate-300">Daily goal: {user.dailyGoal}</p>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs">XP</p>
          <p className="text-lg font-semibold">{user.totalXP}</p>
        </div>
        <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs">Gems</p>
          <p className="text-lg font-semibold">{user.gems}</p>
        </div>
        <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs">Streak</p>
          <p className="text-lg font-semibold">🔥 {user.streak} days</p>
        </div>
      </div>
    </header>
  );
}
