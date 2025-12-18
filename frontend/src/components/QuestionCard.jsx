import React, { useState } from 'react';

export default function QuestionCard({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    onAnswer(question, value);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <p className="text-sm text-slate-300 mb-3">{question.prompt}</p>
      {question.type === 'mcq' && (
        <div className="grid gap-2">
          {question.options.map((option) => (
            <button
              key={option}
              className={`rounded-lg border px-3 py-2 text-left ${
                selected === option
                  ? 'border-primary bg-sky-900/40'
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
              className={`flex-1 rounded-lg border px-3 py-2 ${
                selected === value
                  ? 'border-primary bg-sky-900/40'
                  : 'border-slate-700 hover:border-primary'
              }`}
              onClick={() => handleSelect(value)}
            >
              {value ? 'True' : 'False'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
