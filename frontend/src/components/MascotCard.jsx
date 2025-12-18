import React from 'react';

export default function MascotCard({ message }) {
  return (
    <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 text-slate-100 rounded-xl p-4 flex gap-3 items-start shadow-lg">
      <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-slate-900 font-bold text-xl">
        🐸
      </div>
      <div>
        <p className="text-sm text-slate-300">Coach Ribbit</p>
        <p className="text-base font-semibold">{message}</p>
        <p className="text-xs text-slate-200 mt-1">Tip: Keep your streak alive with a quick 5-minute review.</p>
      </div>
    </div>
  );
}
