import React from 'react';

export default function LessonCard({ lesson, onStart }) {
  return (
    <article className="rounded-2xl bg-slate-900 border border-slate-700 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">{lesson.unit}</p>
          <h3 className="text-lg font-semibold">{lesson.title}</h3>
        </div>
        <span className="text-xs bg-slate-800 px-2 py-1 rounded-full border border-slate-700">{lesson.difficulty}</span>
      </div>
      <p className="text-sm text-slate-300">{lesson.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-secondary font-semibold">{lesson.xp} XP</span>
        <span className="text-slate-400">{lesson.questions.length} questions</span>
      </div>
      <button
        onClick={onStart}
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 font-semibold text-slate-900 hover:brightness-110"
      >
        Start Lesson
      </button>
    </article>
  );
}
