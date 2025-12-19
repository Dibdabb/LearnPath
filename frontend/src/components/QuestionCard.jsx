import React, { useState } from 'react';

export default function QuestionCard({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    const isCorrect = question.answer === value;
    setResult(isCorrect ? 'correct' : 'wrong');
    onAnswer(question, value, isCorrect);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
      <p className="text-sm text-slate-300">{question.prompt}</p>
      {question.type === 'mcq' && (
        <div className="grid gap-2">
          {question.options.map((option) => (
            <button
              key={option}
              className={`rounded-lg border px-3 py-2 text-left transition ${
                selected === option
                  ? result === 'correct'
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-rose-400 bg-rose-500/10'
                  : 'border-slate-700 hover:border-primary'
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {question.type === 'tf' && (
        <div className="flex gap-2">
          {[true, false].map((value) => (
            <button
              key={value.toString()}
              className={`flex-1 rounded-lg border px-3 py-2 transition ${
                selected === value
                  ? result === 'correct'
                    ? 'border-emerald-400 bg-emerald-500/10'
                    : 'border-rose-400 bg-rose-500/10'
                  : 'border-slate-700 hover:border-primary'
              }`}
              onClick={() => handleSelect(value)}
            >
              {value ? 'True' : 'False'}
            </button>
          ))}
        </div>
      )}
      {result && (
        <p className={`text-xs font-semibold ${result === 'correct' ? 'text-emerald-300' : 'text-rose-300'}`}>
          {result === 'correct' ? 'Nice! That was correct.' : 'Not quite — try the next one!'}
        </p>
      )}
    </div>
  );
}
