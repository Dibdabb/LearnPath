import React, { useState } from 'react';
import Header from './components/Header';
import XPBar from './components/XPBar';
import CourseMap from './components/CourseMap';
import QuestionCard from './components/QuestionCard';
import FriendsFeed from './components/FriendsFeed';
import MascotCard from './components/MascotCard';
import { lessons as lessonData, userProfile, feedItems } from './data/mockData';

export default function App() {
  const [selectedLesson, setSelectedLesson] = useState(lessonData[0]);
  const [xpEarned, setXpEarned] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleStartLesson = (lesson) => {
    setSelectedLesson(lesson);
    setAnswers({});
    setXpEarned(0);
  };

  const handleAnswer = (question, response) => {
    setAnswers((prev) => ({ ...prev, [question.id]: response }));
    const isCorrect = response === question.answer;
    if (isCorrect) {
      setXpEarned((prev) => prev + 5);
    }
  };

  const completedQuestions = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Header user={userProfile} />
        <XPBar currentXP={userProfile.totalXP + xpEarned} goalXP={1500} />
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <CourseMap lessons={lessonData} onStartLesson={handleStartLesson} />
            <section className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase text-slate-400">Current Lesson</p>
                  <h2 className="text-xl font-semibold">{selectedLesson.title}</h2>
                </div>
                <span className="text-sm text-emerald-400">XP +{xpEarned}</span>
              </div>
              <div className="space-y-3">
                {selectedLesson.questions.map((q) => (
                  <QuestionCard key={q.id} question={q} onAnswer={handleAnswer} />
                ))}
                {selectedLesson.questions.length === 0 && (
                  <p className="text-sm text-slate-300">This lesson uses placeholder content. Add questions in the backend to enable practice.</p>
                )}
              </div>
              <div className="mt-4 text-sm text-slate-300">
                {completedQuestions}/{selectedLesson.questions.length || 1} answered • Earn {selectedLesson.xp} XP when you finish.
              </div>
            </section>
          </div>
          <div className="space-y-4">
            <MascotCard message="Great work! Finish one more lesson to keep your streak." />
            <FriendsFeed items={feedItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
