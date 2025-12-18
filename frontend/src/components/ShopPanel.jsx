import React from 'react';
import { SparklesIcon, BoltIcon } from '@heroicons/react/24/solid';

export default function ShopPanel({ items, inventory, onBuy, onActivate, activeBoosts }) {
  const inventoryMap = Object.fromEntries(inventory.map((i) => [i.itemId, i.quantity]));
  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <SparklesIcon className="w-5 h-5 text-amber-300" />
        <h3 className="font-semibold">Shop & Boosts</h3>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-slate-900/50 border border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-slate-400">{item.multiplier}x XP • {item.durationMinutes} min</p>
              <p className="text-xs text-amber-300">Cost: {item.costGems} gems</p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => onBuy(item.id)}
                className="px-3 py-1 rounded-lg bg-amber-400 text-slate-900 text-sm font-semibold hover:bg-amber-300"
              >
                Buy
              </button>
              <button
                onClick={() => onActivate(item.id)}
                disabled={!inventoryMap[item.id]}
                className={`px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1 ${
                  inventoryMap[item.id]
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <BoltIcon className="w-4 h-4" /> Activate ({inventoryMap[item.id] || 0})
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-3 text-sm text-emerald-200">
        <p className="font-semibold flex items-center gap-2">
          <BoltIcon className="w-4 h-4" /> Active boosts
        </p>
        {activeBoosts.length === 0 && <p className="text-emerald-100/80 mt-1">No boosts running.</p>}
        {activeBoosts.map((boost) => (
          <div key={boost.id} className="flex justify-between text-emerald-100">
            <span>{boost.itemId}</span>
            <span>
              x{boost.multiplier} until {new Date(boost.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
