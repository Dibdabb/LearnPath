import React from 'react';
import LessonCard from './LessonCard';

export default function CourseMap({ lessons, onStartLesson }) {
  return (
    <section className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-400 uppercase">Guided Path</p>
          <h2 className="text-xl font-semibold">National 5 Biology</h2>
        </div>
        <span className="text-sm text-secondary">Unit 1 • Cell Biology</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} onStart={() => onStartLesson(lesson)} />
        ))}
      </div>
    </section>
  );
}
