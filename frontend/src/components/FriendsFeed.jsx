import React from 'react';

export default function FriendsFeed({ items }) {
  return (
    <section className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs uppercase text-slate-400">Social</p>
          <h2 className="text-lg font-semibold">Friends Feed</h2>
        </div>
        <span className="text-xs bg-slate-900 border border-slate-700 px-2 py-1 rounded-full">Weekly league</span>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-2">
            <p className="text-sm">{item.text}</p>
            <p className="text-xs text-slate-400">{item.time}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
