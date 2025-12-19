import React from 'react';
import { PlayIcon, LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export default function LearnPath({ lessons, onSelect, selectedLessonId }) {
  return (
    <div className="relative bg-slate-800/70 border border-slate-700 rounded-2xl p-4 overflow-hidden">
      <div className="absolute inset-y-0 left-6 w-px bg-gradient-to-b from-amber-300/50 via-amber-500/30 to-amber-300/50" aria-hidden />
      <div className="flex flex-col gap-6 relative">
        {lessons.map((lesson) => {
          const locked = lesson.locked;
          const completed = lesson.completed;
          const active = selectedLessonId === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => onSelect(lesson)}
              disabled={locked}
              className={`group text-left relative pl-12 pr-4 py-3 rounded-xl border transition transform hover:translate-x-1 ${
                active
                  ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-500/20'
                  : 'border-slate-700 bg-slate-900/50 hover:border-amber-400/70'
              } ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <span
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full grid place-items-center ${
                  completed
                    ? 'bg-emerald-500 text-white'
                    : active
                    ? 'bg-amber-400 text-slate-900'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                {completed ? <CheckCircleIcon className="w-5 h-5" /> : locked ? <LockClosedIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
              </span>
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-amber-200/80">{lesson.unit}</p>
                  <p className="font-semibold text-lg">{lesson.title}</p>
                  <p className="text-sm text-slate-300">{lesson.description}</p>
                  <p className="text-xs text-slate-400">XP {lesson.xp} • {lesson.prerequisites.length ? 'Prerequisites met' : 'Start here'}</p>
                </div>
                {!locked && !completed && <span className="text-amber-300 text-sm">Start</span>}
                {completed && <span className="text-emerald-300 text-sm font-semibold">Completed</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
